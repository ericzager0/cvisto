import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.4,
    maxOutputTokens: 12000,
    topP: 0.85,
    topK: 40,
  },
});

function buildPrompt(profile: any, analysis: any) {
  const systemPrompt = `
Eres un experto en redacción de CVs y recursos humanos con años de experiencia ayudando a candidatos a destacarse.
      
      FORMATO DE RESPUESTA:
      Debes responder ÚNICAMENTE con un objeto JSON válido. NO incluyas explicaciones, comentarios, ni texto adicional.
      NO uses backticks ni marcadores de código.
      ASEGÚRATE de que todos los strings estén correctamente escapados y cerrados.
      NO incluyas el símbolo • al inicio de cada línea (los bullets se agregan automáticamente después)


      TAREAS:
      Tu objetivo es tomar el perfil del candidato y el análisis de match con una oferta laboral específica, 
      y generar contenido optimizado y personalizado para un CV que maximice las posibilidades de éxito.

      1. **Resumen Profesional**: Escribe un resumen profesional potente de 2-4 líneas que:
         - Destaque las fortalezas más relevantes para la oferta
         - Mencione años de experiencia y área de especialización
         - Incluya 2-3 keywords importantes de la oferta
         - Sea específico y cuantificable cuando sea posible
         - Suene profesional y no genérico

      2. **Experiencias Laborales**: Para cada experiencia laboral del candidato:
         - Reescribe la descripción para que sea más impactante y orientada a resultados
         - Resalta los logros que sean más relevantes para la oferta
         - Usa verbos de acción fuertes (Lideré, Implementé, Optimicé, etc.)
         - Incluye métricas y números cuando sea posible
         - Si la experiencia no es muy relevante, hazla más concisa
         - Ordena las experiencias por relevancia (las más relevantes primero)

      3. **Habilidades Técnicas**: 
         - Selecciona y ordena las habilidades por relevancia para la oferta
         - Agrupa las habilidades en categorías si tiene sentido (ej: "Lenguajes", "Frameworks", "Herramientas")
         - Prioriza las que aparecen en los requisitos de la oferta
         - Elimina habilidades muy básicas o poco relevantes
         - Máximo 15-20 habilidades para no saturar

      4. **Proyectos**: Si el candidato tiene proyectos:
         - Reescribe las descripciones para hacerlas más impactantes
         - Destaca los que usen tecnologías mencionadas en la oferta
         - Enfócate en el valor/impacto del proyecto
         - Menciona tecnologías específicas usadas

      5. **Educación**: 
         - Ordena por relevancia/fecha
         - Mantén solo lo más importante (últimos títulos o más relevantes)

      6. **Idiomas**: 
         - Mantén los idiomas con sus niveles
         - Prioriza los que sean requisitos de la oferta

      IMPORTANTE:
      - TODO en español argentino
      - Sé específico y orientado a resultados
      - Usa un lenguaje profesional pero no rebuscado
      - No inventes información, solo optimiza lo que existe
      - Prioriza la calidad sobre la cantidad
      - Mantén coherencia en el tono y estilo
      - Para las fechas usa formato "MM/AAAA" (ej: "03/2024") o "Mes AAAA" (ej: "Mar 2024")
      - Para fechas actuales/sin finalizar usa "Presente"
      - Si no hay datos para una sección opcional (certifications, awards, publications, volunteering), devuelve un array vacío []
      - En experiences, agrupa logros por proyecto cuando tenga sentido
      - IMPORTANTE: NO incluyas símbolos de bullets (•, -, *) al inicio de las líneas en "bullets" - estos se agregan automáticamente al generar el documento

      Devuelve JSON con esta estructura EXACTA:
      {
        "header": {
          "name": "Nombre Apellido",
          "address": "Ciudad, Estado/Provincia, País",
          "phone": "+54 9 11 0000-0000",
          "email": "correo@dominio.com",
          "links": [
            {"label": "LinkedIn", "url": "https://..."},
            {"label": "GitHub", "url": "https://..."}
          ]
        },
        "education": [
          {
            "university_name": "Universidad",
            "city_state_country": "Ciudad, Estado/País",
            "degree": "Licenciatura en Sistemas",
            "major": "Ingeniería en Informática",
            "expected_graduation": "Dic 2026",
            "gpa": null,
            "honors": ["Honor 1", "Honor 2"],
            "relevant_coursework": ["Materia 1", "Materia 2"]
          }
        ],
        "experiences": [
          {
            "company_name": "Empresa",
            "city_state_country": "Ciudad, Estado/País",
            "position_title": "Puesto",
            "group_name": "Equipo o área",
            "start_date": "03/2024",
            "end_date": "Presente",
            "summary_sentence": "Frase de resumen del rol y resultados globales.",
            "selected_experiences": [
              {
                "project_name": "Proyecto 1",
                "bullets": [
                  "Implementó X con Y para reducir Z en 35% (p95).",
                  "Diseñó API REST con Spring Boot y PostgreSQL; aumentó throughput 2.1x."
                ]
              },
              {
                "project_name": "Proyecto 2",
                "bullets": [
                  "Automatizó CI/CD con Docker y GitHub Actions; bajó lead time 40%."
                ]
              }
            ]
          }
        ],
        "projects_independent": [
          {
            "project_name": "Nombre del proyecto",
            "stack": ["React", "Node.js", "PostgreSQL", "Docker"],
            "link": "https://...",
            "bullets": [
              "Arquitectura de microservicios; 5k rps sostenidos.",
              "Cache con Redis; latencia p95 menos 30%."
            ]
          }
        ],
        "skills": {
          "languages_spoken": [
            {"name": "Español", "level": "Nativo"},
            {"name": "Inglés", "level": "C2"}
          ],
          "programming_languages": ["Java", "Python", "JavaScript", "TypeScript"],
          "frameworks_tools": ["Spring Boot", "React", "Node.js", "Git", "Docker"],
          "databases": ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
          "devops_cloud": ["CI/CD", "AWS", "GCP"],
          "methodologies": ["Scrum", "REST", "Microservicios"]
        },
        "certifications": [
          {"name": "Certificación X", "issuer": "Entidad", "year": "2024", "id_or_url": null}
        ],
        "awards": [
          {"title": "Premio o beca", "issuer": "Organización", "year": "2023", "description": "Motivo o impacto"}
        ],
        "publications": [
          {"title": "Título", "venue": "Conferencia o medio", "year": "2022", "url": "https://..."}
        ],
        "volunteering": [
          {"organization": "Nombre", "role": "Rol", "start_date": "02/2023", "end_date": "Presente", "bullets": ["Logro 1", "Logro 2"]}
        ],
        "interests": ["Interés 1", "Interés 2"]
      }
    `;

    const profileSummary = `
      PERFIL COMPLETO DEL CANDIDATO:
      
      Nombre: ${profile.firstName} ${profile.lastName}
      Email: ${profile.email}
      Teléfono: ${profile.phoneNumber || "No especificado"}
      Ubicación: ${profile.location || "No especificada"}
      
      ${profile.bio ? `Biografía actual:\n${profile.bio}\n` : ""}
      
      Links/Redes:
      ${
        profile.links?.length > 0
          ? profile.links.map((l: any) => `- ${l.link}`).join("\n")
          : "No especificados"
      }
      
      Habilidades:
      ${
        profile.skills?.length > 0
          ? profile.skills.map((s: any) => `- ${s.skill}`).join("\n")
          : "No especificadas"
      }
      
      Experiencia Laboral:
      ${
        profile.experiences?.length > 0
          ? profile.experiences
              .map(
                (exp: any) =>
                  `
        ID: ${exp.id}
        Puesto: ${exp.title}
        Empresa: ${exp.company}
        Período: ${exp.startDate || "?"} a ${exp.endDate || "Actualidad"}
        Descripción: ${exp.description || "No especificada"}
        `
              )
              .join("\n---\n")
          : "No especificada"
      }
      
      Educación:
      ${
        profile.educations?.length > 0
          ? profile.educations
              .map(
                (edu: any) =>
                  `
        ID: ${edu.id}
        Título: ${edu.degree}
        Institución: ${edu.school}
        Período: ${edu.startDate || "?"} a ${edu.endDate || "Actualidad"}
        ${edu.description ? `Descripción: ${edu.description}` : ""}
        `
              )
              .join("\n---\n")
          : "No especificada"
      }
      
      ${
        profile.projects?.length > 0
          ? `Proyectos:
      ${profile.projects
        .map(
          (proj: any) =>
            `
        ID: ${proj.id}
        Nombre: ${proj.name}
        Descripción: ${proj.description || "No especificada"}
        Período: ${proj.startDate || "?"} a ${proj.endDate || "Actualidad"}
        `
        )
        .join("\n---\n")}`
          : ""
      }
      
      Idiomas:
      ${
        profile.languages?.length > 0
          ? profile.languages
              .map((lang: any) => `- ${lang.name} (${lang.proficiency})`)
              .join("\n")
          : "No especificados"
      }
    `;

    const analysisSummary = `
      ANÁLISIS DE MATCH CON LA OFERTA:
      
      Puntaje de Match: ${analysis.matchScore}%
      
      Keywords de la Oferta:
      ${analysis.keywords?.join(", ") || "No disponibles"}
      
      Requisitos Imprescindibles (Must-haves):
      ${
        analysis.must_haves?.length > 0
          ? analysis.must_haves.map((r: string) => `- ${r}`).join("\n")
          : "No especificados"
      }
      
      Requisitos Deseables (Nice-to-haves):
      ${
        analysis.nice_to_haves?.length > 0
          ? analysis.nice_to_haves.map((r: string) => `- ${r}`).join("\n")
          : "No especificados"
      }
      
      Brechas Identificadas:
      ${
        analysis.gaps?.length > 0
          ? analysis.gaps.map((g: string) => `- ${g}`).join("\n")
          : "Ninguna"
      }
      
      Resumen para Recruiter:
      ${analysis.summaryForRecruiter || "No disponible"}
      
      Sugerencias:
      ${
        analysis.suggestions?.length > 0
          ? analysis.suggestions.map((s: any) => `- ${s.text}`).join("\n")
          : "Ninguna"
      }
    `;

    const userPrompt = `
      ${profileSummary}
      
      ${analysisSummary}
      
      Con base en este perfil y análisis, genera el contenido optimizado para un CV personalizado que maximice 
      las posibilidades del candidato para esta oferta específica. Devuelve el resultado en el formato JSON especificado.
    `;

  return `${systemPrompt}\n\n${userPrompt}\n\nRespond ONLY with valid JSON.`;
}

// Función reutilizable para generar los datos del CV
export async function generateCvDataLogic(profile: any, analysis: any) {
  console.log("Generando datos del CV con Gemini...");

  if (!profile || !analysis) {
    throw new Error("Missing required fields: profile and analysis");
  }

  // Construir el prompt usando la función buildPrompt
  const fullPrompt = buildPrompt(profile, analysis);

  // Llamar a Gemini
  console.log("Generating CV data with Gemini...");

  const result = await model.generateContent(fullPrompt);
  const response = result.response;

  // Validar respuesta
  if (!response.candidates || response.candidates.length === 0) {
    throw new Error("Gemini no generó respuesta");
  }

  const candidate = response.candidates[0];

  if (candidate.finishReason === "MAX_TOKENS") {
    throw new Error(
      "La respuesta fue truncada. Intentá con menos información."
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
  let cvData;
  try {
    cvData = JSON.parse(jsonContent);
  } catch (parseError) {
    console.error("Error parsing JSON:", parseError);
    console.error("Raw content:", content);

    // Intentar arreglar JSON común con problemas
    const fixedJson = jsonContent
      .replace(/,(\s*[}\]])/g, "$1") // Trailing commas
      .replace(/\n/g, " ")
      .replace(/\r/g, " ");

    try {
      cvData = JSON.parse(fixedJson);
    } catch (secondError) {
      throw new Error(
        `No se pudo parsear el JSON generado: ${
          parseError instanceof Error ? parseError.message : "Unknown error"
        }`
      );
    }
  }

  console.log("CV data generated successfully");
  return cvData;
}

// API Route Handler
export async function POST(request: NextRequest) {
  try {
    const { profile, analysis } = await request.json();
    const cvData = await generateCvDataLogic(profile, analysis);
    return NextResponse.json(cvData);
  } catch (error) {
    console.error("Error generating CV data:", error);
    return NextResponse.json(
      {
        error: "Failed to generate CV data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
