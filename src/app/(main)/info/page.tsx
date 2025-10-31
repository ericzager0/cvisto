import {
  Info,
  CheckCircle2,
  XCircle,
  Zap,
  Shield,
  TrendingUp,
  FileText,
  Search,
  Bot,
} from "lucide-react";
import Image from "next/image";

export default function InfoPage() {
  return (
    <div className="mx-auto flex flex-col gap-12 my-[40px] max-w-[1000px] px-4">
      {/* Hero Section */}
      <div className="flex flex-col gap-4 text-center items-center">
        <Image
          src="/cvisto.png"
          alt="CVisto's logo"
          width={600}
          height={150}
          style={{ width: "300px", height: "auto" }}
          priority
        />
        <p className="text-xl text-muted-foreground">
          Tu aliado inteligente para superar los sistemas de selección
          automatizados
        </p>
      </div>

      {/* El Problema */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold">El Problema</h2>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 space-y-4">
          <p className="text-lg">
            <strong>
              El 75% de los CVs nunca llegan a manos de un reclutador humano.
            </strong>{" "}
            Son descartados por sistemas automatizados llamados ATS (Applicant
            Tracking Systems).
          </p>
          <p>
            Estos sistemas escanean tu CV en segundos, buscando palabras clave
            específicas, formato compatible y estructura clara. Si tu CV no está
            optimizado, termina en la pila de rechazados automáticamente, sin
            importar qué tan calificado estés.
          </p>
          <div className="bg-white rounded-lg p-4 border border-red-300">
            <p className="font-semibold text-red-700 mb-2">
              Errores comunes que rechazan los ATS:
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                • Tablas, columnas o diseños complejos que confunden al parser
              </li>
              <li>• Imágenes, gráficos o iconos que el ATS no puede leer</li>
              <li>• Headers/footers con información crítica que se pierde</li>
              <li>• Fuentes decorativas o texto en formato imagen</li>
              <li>• Falta de palabras clave del puesto específico</li>
              <li>
                • Secciones con nombres no estándar (el ATS no sabe qué son)
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Nuestra Solución */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold">Nuestra Solución</h2>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
          <p className="text-lg font-semibold text-green-700">
            CVisto combina tecnología de IA con conocimiento experto en ATS para
            crear CVs que superan filtros automatizados
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-white rounded-lg p-4 border border-green-300">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-[#5D3A9B] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">Editor ATS-Friendly</h3>
                  <p className="text-sm">
                    Formato limpio y estructurado que los ATS pueden leer
                    perfectamente. Sin trucos visuales, solo contenido
                    parseable.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-green-300">
              <div className="flex items-start gap-3">
                <Bot className="w-5 h-5 text-[#5D3A9B] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">Escáner Inteligente</h3>
                  <p className="text-sm">
                    IA que analiza ofertas laborales y extrae palabras clave
                    críticas que el ATS va a buscar en tu CV.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-green-300">
              <div className="flex items-start gap-3">
                <Search className="w-5 h-5 text-[#5D3A9B] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">Web Scraping Inteligente</h3>
                  <p className="text-sm">
                    Búsqueda automática en LinkedIn, Bumeran y Computrabajo.
                    Encuentra oportunidades sin buscar manualmente.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-green-300">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-[#5D3A9B] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">Potenciador de Perfil</h3>
                  <p className="text-sm">
                    IA sugiere habilidades para aprender y proyectos para
                    construir, con recursos gratuitos incluidos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo Funcionan los ATS */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold">¿Cómo Funcionan los ATS?</h2>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-6">
          <p className="text-lg">
            Un ATS (Applicant Tracking System) es un software que automatiza el
            proceso de reclutamiento. Aquí está el proceso técnico:
          </p>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-5 border border-blue-300">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="bg-[#5D3A9B] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
                  1
                </span>
                Parsing del Documento
              </h3>
              <p className="text-sm mb-3">
                El ATS convierte tu PDF/DOCX en texto plano usando OCR y parsers
                especializados. Busca patrones para identificar secciones:
              </p>
              <div className="bg-blue-50 p-3 rounded text-sm space-y-1 font-mono">
                <p>• "Experience" / "Experiencia" → Sección de trabajos</p>
                <p>• "Education" / "Educación" → Sección académica</p>
                <p>• "Skills" / "Habilidades" → Competencias técnicas</p>
                <p>• Fechas en formato MM/YYYY → Períodos laborales</p>
              </div>
              <p className="text-sm mt-3 text-blue-700">
                <strong>Problema:</strong> Nombres creativos como "Mi
                Trayectoria" o "Donde estudié" confunden al parser.
              </p>
            </div>

            <div className="bg-white rounded-lg p-5 border border-blue-300">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="bg-[#5D3A9B] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
                  2
                </span>
                Extracción de Keywords
              </h3>
              <p className="text-sm mb-3">
                El reclutador configura palabras clave obligatorias y
                opcionales. El ATS busca coincidencias exactas y variaciones:
              </p>
              <div className="bg-blue-50 p-3 rounded text-sm space-y-2">
                <div>
                  <p className="font-semibold">
                    Puesto: "Desarrollador Full Stack"
                  </p>
                  <p className="text-xs mt-1">
                    Keywords obligatorias: React, Node.js, PostgreSQL, Git
                  </p>
                  <p className="text-xs">
                    Keywords opcionales: TypeScript, Docker, AWS, Agile
                  </p>
                </div>
              </div>
              <p className="text-sm mt-3 text-blue-700">
                <strong>Estrategia CVisto:</strong> Nuestro escáner extrae estas
                keywords de la oferta y te sugiere dónde incluirlas.
              </p>
            </div>

            <div className="bg-white rounded-lg p-5 border border-blue-300">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="bg-[#5D3A9B] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
                  3
                </span>
                Scoring y Ranking
              </h3>
              <p className="text-sm mb-3">
                El ATS asigna un puntaje basado en múltiples factores:
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <p className="font-semibold text-green-700 mb-1">
                    ✓ Suma Puntos
                  </p>
                  <ul className="text-xs space-y-1">
                    <li>• Keywords en título de trabajo</li>
                    <li>• Años de experiencia requeridos</li>
                    <li>• Educación relevante</li>
                    <li>• Certificaciones mencionadas</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-3 rounded border border-red-200">
                  <p className="font-semibold text-red-700 mb-1">
                    ✗ Resta Puntos
                  </p>
                  <ul className="text-xs space-y-1">
                    <li>• Errores de parsing</li>
                    <li>• Fechas faltantes/inconsistentes</li>
                    <li>• Gaps laborales sin explicar</li>
                    <li>• Keywords en contexto irrelevante</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm mt-3 text-blue-700">
                <strong>Típicamente:</strong> Solo los CVs con 70%+ de match
                pasan a revisión humana.
              </p>
            </div>

            <div className="bg-white rounded-lg p-5 border border-blue-300">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="bg-[#5D3A9B] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
                  4
                </span>
                Filtros Automáticos
              </h3>
              <p className="text-sm mb-3">
                Descalificaciones automáticas sin revisión humana:
              </p>
              <div className="bg-red-50 p-3 rounded text-sm space-y-2 border border-red-200">
                <p>❌ Menos años de experiencia que el mínimo requerido</p>
                <p>
                  ❌ Falta keyword obligatoria (ej: "Python" para Developer
                  Python Sr)
                </p>
                <p>
                  ❌ Formato incompatible (CV no pudo ser parseado
                  correctamente)
                </p>
                <p>❌ Información de contacto faltante o mal ubicada</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CV ATS-Friendly vs No-Friendly */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Zap className="w-6 h-6 text-[#5D3A9B]" />
          </div>
          <h2 className="text-3xl font-bold">ATS-Friendly vs No-Friendly</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {/* No ATS-Friendly */}
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-lg">❌ No ATS-Friendly</h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>
                  <strong>Tablas y columnas:</strong> "Habilidades | Nivel |
                  Años" en tabla → el parser no mantiene la relación
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>
                  <strong>Gráficos de barras:</strong> "React ████░ 80%" → el
                  ATS no ve "React"
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>
                  <strong>Headers/Footers:</strong> Email en footer → se pierde
                  en el parsing
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>
                  <strong>Text boxes:</strong> Contenido en cuadros de texto
                  flotantes → orden de lectura incorrecto
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>
                  <strong>Fuentes fancy:</strong> Script fonts o decorativas →
                  OCR falla
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>
                  <strong>Títulos creativos:</strong> "Mi Viaje Profesional" en
                  vez de "Experiencia"
                </span>
              </li>
            </ul>
          </div>

          {/* ATS-Friendly */}
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-lg">✓ ATS-Friendly</h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>
                  <strong>Texto simple:</strong> Sin tablas ni columnas. Una
                  línea por skill: "React - Avanzado - 3 años"
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>
                  <strong>Bullets estándar:</strong> Viñetas simples (•, -, →)
                  que cualquier parser reconoce
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>
                  <strong>Contacto al inicio:</strong> Email y teléfono en las
                  primeras líneas del documento
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>
                  <strong>Flujo lineal:</strong> De arriba hacia abajo sin
                  saltos. Como se lee naturalmente
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>
                  <strong>Fuentes estándar:</strong> Arial, Calibri, Times.
                  Tamaño 10-12pt
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>
                  <strong>Secciones estándar:</strong> "Experiencia",
                  "Educación", "Habilidades" (nombres que el ATS reconoce)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>
                  <strong>Fechas consistentes:</strong> MM/YYYY o "Enero 2020 -
                  Presente" (formato uniforme)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>
                  <strong>Keywords naturales:</strong> Integradas en
                  descripciones reales de tu trabajo
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Beneficios Adicionales */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Shield className="w-6 h-6 text-[#5D3A9B]" />
          </div>
          <h2 className="text-3xl font-bold">Beneficios Adicionales</h2>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-[#5D3A9B] text-white w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="font-semibold">Gestión de Postulaciones</p>
                  <p className="text-sm text-muted-foreground">
                    Trackea tus aplicaciones con 7 estados diferentes y notas
                    personalizadas
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-[#5D3A9B] text-white w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="font-semibold">Búsqueda Automatizada</p>
                  <p className="text-sm text-muted-foreground">
                    Web scraping de 3 portales argentinos principales
                    simultáneamente
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-[#5D3A9B] text-white w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="font-semibold">Recomendaciones con IA</p>
                  <p className="text-sm text-muted-foreground">
                    Gemini analiza tu perfil y sugiere puestos ideales para
                    aplicar
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-[#5D3A9B] text-white w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="font-semibold">Agregar Rápido</p>
                  <p className="text-sm text-muted-foreground">
                    Botón para pasar ofertas de búsqueda a postulaciones con un
                    click
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-[#5D3A9B] text-white w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="font-semibold">Desarrollo Continuo</p>
                  <p className="text-sm text-muted-foreground">
                    Sugerencias de skills y proyectos para mejorar tu
                    empleabilidad
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-[#5D3A9B] text-white w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="font-semibold">Todo Gratis</p>
                  <p className="text-sm text-muted-foreground">
                    Recursos de aprendizaje 100% gratuitos: YouTube, docs,
                    cursos online
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#5D3A9B] rounded-lg p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          ¿Listo para potenciar tu empleabilidad?
        </h2>
        <p className="text-lg mb-6 opacity-90">
          Dejá de perder oportunidades. Optimizá tu perfil hoy.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/profile"
            className="bg-white text-[#5D3A9B] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Rellenar Perfil
          </a>
          <a
            href="/postulaciones"
            className="bg-[#4A2D7C] px-6 py-3 rounded-lg font-semibold hover:bg-[#3d2566] transition-colors border-2 border-white"
          >
            Buscar Ofertas
          </a>
        </div>
      </section>
    </div>
  );
}
