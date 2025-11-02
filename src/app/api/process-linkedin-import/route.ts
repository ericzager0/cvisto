import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import sql from "@/lib/db";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    temperature: 0.3,
    maxOutputTokens: 8000,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { userId, data } = await request.json();

    console.log("=== INICIANDO IMPORTACIÓN DE LINKEDIN ===");
    console.log("User ID:", userId);
    console.log("Datos recibidos:", {
      basics: data.basics?.substring(0, 100) + "...",
      experience: data.experience?.substring(0, 100) + "...",
      education: data.education?.substring(0, 100) + "...",
      skills: data.skills?.substring(0, 100) + "...",
    });

    if (!userId || !data) {
      console.error("Error: Faltan campos requeridos");
      return NextResponse.json(
        { error: "Missing required fields", details: "userId y data son requeridos" },
        { status: 400 }
      );
    }

    const prompt = `
Eres un asistente que procesa información de LinkedIn pegada por un usuario y la estructura en un formato JSON limpio.

El usuario pegó esta información de su perfil de LinkedIn:

**Datos básicos:**
${data.basics || "No proporcionado"}

**Experiencia:**
${data.experience || "No proporcionado"}

**Educación:**
${data.education || "No proporcionado"}

**Habilidades:**
${data.skills || "No proporcionado"}

Tu tarea es extraer y estructurar esta información en el siguiente formato JSON. Si falta algún dato, intenta inferirlo del contexto o déjalo vacío. Asegúrate de que las fechas estén en formato ISO (YYYY-MM-DD) o null si no están disponibles.

{
  "profile": {
    "firstName": "string",
    "lastName": "string",
    "location": "string (ciudad, país)",
    "bio": "string (headline o título profesional corto)",
    "phone": null
  },
  "experiences": [
    {
      "title": "string",
      "company": "string",
      "startDate": "YYYY-MM-DD o YYYY-MM-01 si solo tienes mes/año",
      "endDate": "YYYY-MM-DD o null si es trabajo actual",
      "description": "string (bullets o descripción)"
    }
  ],
  "educations": [
    {
      "school": "string (nombre de la institución - OBLIGATORIO)",
      "degree": "string (título o carrera - OBLIGATORIO, si no está claro usa 'Título no especificado')",
      "description": "string o null",
      "startDate": "YYYY-MM-DD o null",
      "endDate": "YYYY-MM-DD o null"
    }
  ],
  "skills": [
    {
      "skill": "string (nombre de la habilidad)"
    }
  ]
}

IMPORTANTE:
- Extrae TODA la información que encuentres
- Si una fecha solo tiene mes y año, usa el día 01 (ej: "ene. 2020" → "2020-01-01")
- Si dice "actualidad" o "presente", usa null en endDate
- Limpia y formatea la descripción (quita caracteres raros)
- Si el nombre completo viene junto, sepáralo en firstName y lastName
- En educations, "school" y "degree" son OBLIGATORIOS, no pueden ser null o vacíos
- Si no hay degree claro, usa "Título no especificado" o similar
- Si no tienes suficiente info para algún campo opcional, usa null

Responde SOLO con el JSON, sin texto adicional.
`;

    console.log("Llamando a Gemini para procesar datos...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    console.log("Respuesta cruda de Gemini (primeros 500 chars):", text.substring(0, 500));

    // Limpiar markdown
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let parsedData;
    try {
      parsedData = JSON.parse(text);
      console.log("JSON parseado exitosamente");
    } catch (parseError) {
      console.log("Error al parsear JSON directamente, intentando extraer...");
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
        console.log("JSON extraído y parseado exitosamente");
      } else {
        console.error("No se pudo encontrar JSON en la respuesta");
        console.error("Texto completo:", text);
        throw new Error("No se pudo parsear la respuesta de la IA");
      }
    }

    console.log("Datos estructurados:", {
      profile: parsedData.profile,
      experiencesCount: parsedData.experiences?.length || 0,
      educationsCount: parsedData.educations?.length || 0,
      skillsCount: parsedData.skills?.length || 0,
    });

    console.log("Actualizando perfil en base de datos...");
    // Actualizar el perfil en la base de datos
    await sql`
      UPDATE users
      SET first_name = ${parsedData.profile.firstName},
          last_name = ${parsedData.profile.lastName},
          location = ${parsedData.profile.location},
          bio = ${parsedData.profile.bio},
          phone_number = ${parsedData.profile.phone}
      WHERE id = ${userId}
    `;
    console.log("Perfil actualizado");

    // Insertar experiencias
    if (parsedData.experiences && parsedData.experiences.length > 0) {
      console.log(`Insertando ${parsedData.experiences.length} experiencias...`);
      for (const exp of parsedData.experiences) {
        // Validar campos obligatorios
        if (!exp.title || !exp.company) {
          console.warn("Experiencia sin título o empresa, saltando:", exp);
          continue;
        }
        await sql`
          INSERT INTO experiences (user_id, title, company, description, start_date, end_date)
          VALUES (${userId}, ${exp.title}, ${exp.company}, ${exp.description || null}, ${exp.startDate || null}, ${exp.endDate || null})
        `;
      }
      console.log("Experiencias insertadas");
    }

    // Insertar educaciones
    if (parsedData.educations && parsedData.educations.length > 0) {
      console.log(`Insertando ${parsedData.educations.length} educaciones...`);
      for (const edu of parsedData.educations) {
        // Validar campos obligatorios
        if (!edu.school || !edu.degree) {
          console.warn("Educación sin school o degree, saltando:", edu);
          continue;
        }
        await sql`
          INSERT INTO educations (user_id, school, degree, description, start_date, end_date)
          VALUES (${userId}, ${edu.school}, ${edu.degree}, ${edu.description || null}, ${edu.startDate || null}, ${edu.endDate || null})
        `;
      }
      console.log("Educaciones insertadas");
    }

    // Insertar habilidades
    if (parsedData.skills && parsedData.skills.length > 0) {
      console.log(`Insertando ${parsedData.skills.length} habilidades...`);
      for (const skill of parsedData.skills) {
        // Validar campo obligatorio
        if (!skill.skill) {
          console.warn("Skill vacío, saltando:", skill);
          continue;
        }
        await sql`
          INSERT INTO skills (user_id, skill)
          VALUES (${userId}, ${skill.skill})
        `;
      }
      console.log("Habilidades insertadas");
    }

    console.log("=== IMPORTACIÓN COMPLETADA EXITOSAMENTE ===");
    return NextResponse.json({
      success: true,
      message: "Perfil importado exitosamente",
    });
  } catch (error) {
    console.error("=== ERROR EN IMPORTACIÓN ===");
    console.error("Error completo:", error);
    console.error("Tipo de error:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Mensaje:", error instanceof Error ? error.message : "Unknown error");
    console.error("Stack:", error instanceof Error ? error.stack : "No stack");
    
    return NextResponse.json(
      {
        error: "Failed to process LinkedIn import",
        details: error instanceof Error ? error.message : "Unknown error",
        type: error instanceof Error ? error.constructor.name : "Unknown",
      },
      { status: 500 }
    );
  }
}
