import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    temperature: 0.3,
    maxOutputTokens: 8000,
    topP: 0.8,
    topK: 40,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { profile, jobText } = await request.json();

    if (!profile || !jobText) {
      return NextResponse.json(
        {
          error: "Missing required fields: profile and jobText",
        },
        { status: 400 }
      );
    }

    // Construir el prompt
    const systemPrompt = `
      Eres un experto en recursos humanos y análisis de ofertas laborales.
      FORMATO DE RESPUESTA:
      Debes responder ÚNICAMENTE con un objeto JSON válido. NO incluyas explicaciones, comentarios, ni texto adicional.
      NO uses backticks ni marcadores de código.
      ASEGÚRATE de que todos los strings estén correctamente escapados y cerrados.

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
    `;

    const profileSummary = `
      PERFIL DEL CANDIDATO:
      Nombre: ${profile.name}
      Ubicación: ${profile.location}
      Email: ${profile.email}
      Sobre mí:${profile.about || "No especificado"}
      Habilidades:${profile.skills?.join(", ") || "No especificadas"}
      Experiencia:
        ${
          profile.experience?.length > 0
            ? profile.experience
                .map(
                  (exp: any) =>
                    `- ${exp.role} en ${exp.company} (${
                      exp.current ? "Actual" : "Finalizado"
                    })
        ${exp.description || ""}
        Logros: ${exp.achievements?.join("; ") || "No especificados"}`
                )
                .join("\n")
            : "No especificada"
        }
      Educación:
      ${
        profile.education?.length > 0
          ? profile.education
              .map(
                (edu: any) =>
                  `- ${edu.degree} en ${edu.field}, ${edu.institution}`
              )
              .join("\n")
          : "No especificada"
      }
      ${
        profile.projects?.length > 0
          ? `Proyectos:
      ${profile.projects
        .map((proj: any) => `- ${proj.title}: ${proj.description}`)
        .join("\n")}`
          : ""
      }
    `;

    const userPrompt = `
      ${profileSummary}
      OFERTA DE TRABAJO:
      ${jobText}
      Analizá esta oferta y el perfil del candidato, y devolvé el análisis en formato JSON.
    `;

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}\n\nRespond ONLY with valid JSON.`;

    // Llamar a Gemini
    console.log("Calling Gemini API...");

    const result = await model.generateContent(fullPrompt);
    const response = result.response;

    console.log(response);

    // Validar respuesta
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
