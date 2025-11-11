import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Profile } from "@/lib/queries";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.3,
    maxOutputTokens: 8000,
    topP: 0.8,
    topK: 40,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { profile, jobText }: { profile: Profile; jobText: string } =
      await request.json();

    if (!profile || !jobText) {
      return NextResponse.json(
        {
          error: "Missing required fields: profile and jobText",
        },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(profile, jobText);

    console.log(prompt);

    const result = await model.generateContent(prompt);
    const response = result.response;

    console.log(response);

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("Gemini no generó respuesta");
    }

    const candidate = response.candidates[0];

    if (candidate.finishReason === "MAX_TOKENS") {
      throw new Error(
        "La respuesta fue truncada. Intentá con un aviso más corto."
      );
    }

    if (candidate.finishReason === "SAFETY") {
      throw new Error("Gemini bloqueó la respuesta por contenido inapropiado.");
    }

    const content = response.text();

    if (!content || content.length === 0) {
      throw new Error("Respuesta vacía de Gemini");
    }

    // Parsear JSON (puede venir con backticks)
    let jsonContent = content.trim();
    if (jsonContent.startsWith("```json")) {
      jsonContent = jsonContent.slice(7, -3).trim();
    } else if (jsonContent.startsWith("```")) {
      jsonContent = jsonContent.slice(3, -3).trim();
    }

    // Intentar parsear
    let analysis;
    try {
      analysis = JSON.parse(jsonContent);
    } catch (parseError) {
      // Intentar arreglar JSON común con problemas
      const fixedJson = jsonContent
        .replace(/,(\s*[}\]])/g, "$1") // Trailing commas
        .replace(/\n/g, " ")
        .replace(/\r/g, " ");
      analysis = JSON.parse(fixedJson);
    }

    console.log("Analysis completed. Match score:", analysis.matchScore);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error analyzing job:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze job",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function buildPrompt(profile: Profile, jobText: string) {
  return `
Eres un experto en recursos humanos y análisis de ofertas laborales.

FORMATO DE RESPUESTA:
- Debes responder ÚNICAMENTE con un objeto JSON válido. NO incluyas explicaciones, comentarios, ni texto adicional.
- NO uses backticks ni marcadores de código.
- ASEGÚRATE de que todos los strings estén correctamente escapados y cerrados.

TAREAS:
1. Extraer las palabras clave más importantes del aviso
2. Clasificar los requisitos en "imprescindibles" (must-haves) y "deseables" (nice-to-haves)
3. Calcular un puntaje de coincidencia realista (0-100) basado en:
  - Must-haves cumplidos: 60% del peso
  - Nice-to-haves cumplidos: 20% del peso
  - Años de experiencia: 10% del peso
  - Match cultural/soft skills: 10% del peso
4. Identificar brechas CONCRETAS entre el perfil y los requisitos
5. Generar un resumen profesional de 2-3 líneas que el candidato podría usar
6. Proporcionar sugerencias específicas y accionables

IMPORTANTE:
- Responde SOLO en español argentino
- Sé específico, evita generalidades
- El puntaje debe ser realista (no inflar artificialmente)
- Las brechas deben ser concretas: "Le falta Python" no "Le faltan skills técnicas"

Devuelve JSON con esta estructura:
{
  "keywords": ["palabra1", "palabra2"],
  "must_haves": ["requisito1", "requisito2"],
  "nice_to_haves": ["deseable1", "deseable2"],
  "gaps": ["brecha1", "brecha2"],
  "matchScore": 75,
  "summaryForRecruiter": "Profesional con X años de experiencia en...",
  "suggestions": [
    {"text": "Agregá experiencia en X", "category": "skill"}
  ]
}
  
PERFIL DEL CANDIDATO:
Nombre: ${profile.firstName}
Apellido: ${profile.lastName}
Email: ${profile.email}
Ubicación: ${profile.location}
Biografía:${profile.bio || "No especificado"}
Habilidades: ${
    profile.skills?.map((skill) => skill.skill).join(", ") || "No especificadas"
  }
Experiencia:
${
  profile.experiences?.length > 0
    ? profile.experiences
        .map(
          (exp) =>
            `- ${exp.title} en ${exp.company} (${
              exp.startDate || "Sin especificar"
            } - ${exp.endDate || "Presente"})${
              exp.description ? `: ${exp.description}` : ""
            }`
        )
        .join("\n")
    : "No especificada"
}
Educación:
${
  profile.educations?.length > 0
    ? profile.educations
        .map(
          (edu) =>
            `- ${edu.degree} en ${edu.school}, (${
              edu.startDate ? edu.startDate : "Sin especificar"
            } - ${edu.endDate ? edu.endDate : "Sin especificar"}) ${
              edu.description || ""
            }`
        )
        .join("\n")
    : "No especificada"
}
${
  profile.projects?.length > 0
    ? `Proyectos:
${profile.projects
  .map((proj) => `- ${proj.name}: ${proj.description}`)
  .join("\n")}`
    : ""
}
${
  profile.languages?.length > 0
    ? `Idiomas:
${profile.languages
  .map((lang) => `- ${lang.name}: ${lang.proficiency}`)
  .join("\n")}`
    : ""
}

INICIO OFERTA DE TRABAJO:
${jobText}
FIN OFERTA DE TRABAJO.

Analizá la oferta, el perfil del candidato y devolvé el análisis en formato JSON. Respond ONLY with valid JSON.`;
}
