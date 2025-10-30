import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Profile } from "@/lib/queries";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    temperature: 0.4,
    maxOutputTokens: 8000,
    topP: 0.85,
    topK: 40,
  },
});

export async function POST(request: NextRequest) {
  try {
    console.log("=== Iniciando generación de recomendaciones de perfil ===");
    const { profile }: { profile: Profile } = await request.json();

    if (!profile) {
      console.error("Error: No se recibió el perfil");
      return NextResponse.json(
        { error: "Profile data is required" },
        { status: 400 }
      );
    }

    console.log("Perfil recibido:", {
      nombre: `${profile.firstName} ${profile.lastName}`,
      hasEducations: !!profile.educations?.length,
      hasExperiences: !!profile.experiences?.length,
      hasSkills: !!profile.skills?.length,
    });

    const prompt = buildPrompt(profile);

    console.log("Enviando prompt a Gemini...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    console.log("Respuesta cruda de Gemini:", text);

    // Limpiar la respuesta en caso de que incluya markdown o texto extra
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    console.log("Respuesta limpia:", text);

    // Intentar parsear el JSON
    let recommendations;
    try {
      recommendations = JSON.parse(text);
      console.log("JSON parseado directamente");
    } catch (parseError) {
      console.log("Error al parsear JSON, intentando extraer objeto...");
      // Si falla el parsing, intentar extraer un objeto del texto
      const objectMatch = text.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        recommendations = JSON.parse(objectMatch[0]);
        console.log("Objeto extraído exitosamente");
      } else {
        console.error("No se pudo encontrar un objeto en la respuesta");
        throw new Error("No se pudo parsear la respuesta de la IA");
      }
    }

    // Validar estructura
    if (!recommendations.skills || !recommendations.projects) {
      console.error("Respuesta no tiene la estructura correcta:", recommendations);
      throw new Error("La respuesta no tiene la estructura esperada");
    }

    console.log("Recomendaciones generadas:", {
      skills: recommendations.skills.length,
      projects: recommendations.projects.length,
    });
    console.log("=== Recomendaciones generadas exitosamente ===");

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("=== ERROR al generar recomendaciones ===");
    console.error("Error completo:", error);
    console.error("Mensaje:", error instanceof Error ? error.message : "Unknown error");
    console.error("Stack:", error instanceof Error ? error.stack : "No stack");
    return NextResponse.json(
      {
        error: "Failed to generate recommendations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function buildPrompt(profile: Profile) {
  const profileContext = `
Perfil del usuario:
- Nombre: ${profile.firstName} ${profile.lastName}
- Bio: ${profile.bio || "No especificada"}
- Ubicación: ${profile.location || "No especificada"}

Educación:
${profile.educations?.map((e) => `- ${e.degree} en ${e.school}`).join("\n") || "No especificada"}

Experiencia laboral:
${profile.experiences?.map((e) => `- ${e.title} en ${e.company}: ${e.description || ""}`).join("\n") || "No especificada"}

Habilidades actuales:
${profile.skills?.map((s) => s.skill).join(", ") || "No especificadas"}

Idiomas:
${profile.languages?.map((l) => `${l.name} (${l.proficiency})`).join(", ") || "No especificados"}

Proyectos:
${profile.projects?.map((p) => `- ${p.name}: ${p.description || ""}`).join("\n") || "No especificados"}
`;

  return `
Eres un experto en desarrollo profesional y análisis de carreras en tecnología.

Basándote en el siguiente perfil profesional, genera recomendaciones personalizadas para potenciar su carrera:

${profileContext}

IMPORTANTE: Tu respuesta debe ser ÚNICAMENTE un objeto JSON válido, sin texto adicional.

Estructura requerida:

{
  "skills": [
    {
      "name": "Nombre de la habilidad",
      "reason": "Por qué debería aprender esto (1-2 líneas, relevante a su perfil actual)",
      "difficulty": "Principiante" | "Intermedio" | "Avanzado",
      "resources": [
        {
          "title": "Título del recurso",
          "url": "URL del recurso (curso gratis, tutorial, documentación)",
          "type": "YouTube" | "Curso" | "Documentación" | "Tutorial" | "Artículo",
          "duration": "Duración estimada (ej: 3 horas, 2 semanas)"
        }
      ]
    }
  ],
  "projects": [
    {
      "title": "Título del proyecto",
      "description": "Descripción breve del proyecto (2-3 líneas)",
      "technologies": ["Tecnología 1", "Tecnología 2"],
      "difficulty": "Principiante" | "Intermedio" | "Avanzado",
      "estimatedTime": "Tiempo estimado (ej: 1 semana, 1 mes)",
      "learningOutcomes": ["Qué aprenderás 1", "Qué aprenderás 2"]
    }
  ]
}

Consideraciones importantes:
- Sugiere 5-7 habilidades relevantes y emergentes en su rubro
- Las habilidades deben ser progresivas: algunas para complementar lo que ya sabe, otras más avanzadas
- TODOS los recursos deben ser GRATIS (YouTube, freeCodeCamp, MDN, documentación oficial, etc.)
- Prioriza recursos en español cuando sea posible, pero inglés está bien para contenido técnico
- Sugiere 3-5 proyectos prácticos que pueda hacer
- Los proyectos deben incluir tecnologías nuevas para el usuario pero relacionadas con su experiencia
- Los proyectos deben ser realizables y tener valor para el portfolio
- Considera las tendencias actuales del mercado argentino/LATAM

NO incluyas:
- Recursos de pago o con paywall
- Certificaciones que requieran pago
- Habilidades que ya domina completamente
- Proyectos demasiado simples o demasiado complejos para su nivel

Responde SOLO con el JSON, sin explicaciones adicionales.
`;
}
