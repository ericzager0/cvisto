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
    console.log("=== Iniciando generación de recomendaciones ===");
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
    let positions: string[];
    try {
      positions = JSON.parse(text);
      console.log("JSON parseado directamente");
    } catch (parseError) {
      console.log("Error al parsear JSON, intentando extraer array...");
      // Si falla el parsing, intentar extraer un array del texto
      const arrayMatch = text.match(/\[(.|[\r\n])*\]/);
      if (arrayMatch) {
        positions = JSON.parse(arrayMatch[0]);
        console.log("Array extraído exitosamente");
      } else {
        console.error("No se pudo encontrar un array en la respuesta");
        throw new Error("No se pudo parsear la respuesta de la IA");
      }
    }

    // Validar que sea un array de strings
    if (!Array.isArray(positions) || positions.length === 0) {
      console.error("Respuesta no es un array válido:", positions);
      throw new Error("La respuesta no es un array válido");
    }

    // Limitar a 5 posiciones máximo
    positions = positions.slice(0, 5);

    console.log("Posiciones finales:", positions);
    console.log("=== Recomendaciones generadas exitosamente ===");

    return NextResponse.json({ positions });
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

Habilidades:
${profile.skills?.map((s) => s.skill).join(", ") || "No especificadas"}

Idiomas:
${profile.languages?.map((l) => `${l.name} (${l.proficiency})`).join(", ") || "No especificados"}

Proyectos:
${profile.projects?.map((p) => `- ${p.name}: ${p.description || ""}`).join("\n") || "No especificados"}
`;

  return `
Basándote en el siguiente perfil profesional, genera una lista de 3 a 5 puestos laborales a los que esta persona podría postularse.

${profileContext}

Consideraciones importantes:
- Los puestos deben ser realistas y alcanzables según la experiencia del usuario
- Deben estar relacionados con sus habilidades y experiencia
- Usa nombres de puestos comunes que se usan en Argentina y LATAM
- Sé específico pero no demasiado técnico
- Si la persona tiene experiencia senior, sugiere puestos senior
- Si es junior o tiene poca experiencia, sugiere puestos junior o trainee

Responde ÚNICAMENTE con un array JSON de strings con los nombres de los puestos, sin explicaciones adicionales.
Ejemplo de formato: ["Desarrollador Full Stack", "Ingeniero de Software", "Tech Lead"]

IMPORTANTE: Responde SOLO con el array JSON, nada más.
`;
}