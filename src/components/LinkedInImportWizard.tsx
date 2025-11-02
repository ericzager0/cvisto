"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, ExternalLink, Lightbulb, Info } from "lucide-react";

interface LinkedInImportWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
  userId: string;
}

type Step = "intro" | "basics" | "experience" | "education" | "skills" | "processing";

export default function LinkedInImportWizard({
  open,
  onClose,
  onComplete,
  userId,
}: LinkedInImportWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>("intro");
  const [data, setData] = useState({
    basics: "",
    experience: "",
    education: "",
    skills: "",
  });
  const [processing, setProcessing] = useState(false);

  const handleNext = (field?: keyof typeof data, value?: string) => {
    if (field && value !== undefined) {
      setData(prev => ({ ...prev, [field]: value }));
    }

    const stepOrder: Step[] = ["intro", "basics", "experience", "education", "skills", "processing"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const stepOrder: Step[] = ["intro", "basics", "experience", "education", "skills", "processing"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleProcess = async () => {
    setProcessing(true);
    try {
      // Llamar a la API para procesar los datos con IA
      const response = await fetch("/api/process-linkedin-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, data }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Error response:", result);
        throw new Error(result.details || result.error || "Error al procesar los datos");
      }

      onComplete(result);
    } catch (error) {
      console.error("Error completo:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      alert(`Error al procesar los datos:\n\n${errorMessage}\n\nRevisa la consola para más detalles.`);
    } finally {
      setProcessing(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "intro":
        return (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 space-y-3">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#5D3A9B]" />
                Importá tu perfil desde LinkedIn
              </h3>
              <p className="text-sm text-gray-700">
                Te vamos a guiar paso a paso para copiar tu información de LinkedIn. La IA va a procesar lo que pegues y completar lo que falte.
              </p>
              <div className="bg-white rounded p-4 space-y-2 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#5D3A9B]" />
                  Pasos:
                </p>
                <ol className="space-y-1 ml-4">
                  <li>1. Datos básicos (nombre, ubicación, bio)</li>
                  <li>2. Experiencia laboral</li>
                  <li>3. Educación</li>
                  <li>4. Habilidades</li>
                  <li>5. IA completa lo que falte ✨</li>
                </ol>
              </div>
              <p className="text-xs text-gray-500 flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <span>Consejo: Abrí tu perfil de LinkedIn en otra pestaña para copiar más fácil</span>
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-gray-600">
              <p className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  Esta es la única forma de importar datos que respeta los Términos y Condiciones de LinkedIn. 
                  No usamos scraping automático ni APIs no autorizadas.
                </span>
              </p>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={() => handleNext()} className="bg-[#5D3A9B] hover:bg-[#4A2D7C]">
                Comenzar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case "basics":
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <h3 className="font-bold">Paso 1: Datos básicos</h3>
              <div className="space-y-2 text-sm">
                <p className="font-semibold">Qué copiar de LinkedIn:</p>
                <ol className="space-y-1 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-[#5D3A9B] mt-0.5">•</span>
                    <span>Tu nombre completo (como aparece en el header)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5D3A9B] mt-0.5">•</span>
                    <span>Tu ubicación (ej: "Buenos Aires, Argentina")</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5D3A9B] mt-0.5">•</span>
                    <span>Tu bio/headline (el texto debajo de tu nombre)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5D3A9B] mt-0.5">•</span>
                    <span>Si tenés, tu descripción "Acerca de"</span>
                  </li>
                </ol>
                <a
                  href="https://www.linkedin.com/in/me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                >
                  Abrir mi perfil de LinkedIn
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Pegá aquí tu información:</label>
              <Textarea
                value={data.basics}
                onChange={(e) => setData(prev => ({ ...prev, basics: e.target.value }))}
                placeholder="Ejemplo:&#10;Juan Pérez&#10;Buenos Aires, Argentina&#10;Desarrollador Full Stack | React | Node.js&#10;&#10;Acerca de:&#10;Desarrollador con 5 años de experiencia..."
                className="min-h-[200px]"
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button
                onClick={() => handleNext("basics", data.basics)}
                disabled={!data.basics.trim()}
                className="bg-[#5D3A9B] hover:bg-[#4A2D7C]"
              >
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case "experience":
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <h3 className="font-bold">Paso 2: Experiencia laboral</h3>
              <div className="space-y-2 text-sm">
                <p className="font-semibold">Qué copiar de LinkedIn:</p>
                <ol className="space-y-1 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-[#5D3A9B] mt-0.5">•</span>
                    <span>Toda la sección "Experiencia"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5D3A9B] mt-0.5">•</span>
                    <span>Incluye: título del puesto, empresa, fechas, descripción</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5D3A9B] mt-0.5">•</span>
                    <span>Copia todos tus trabajos (actuales y anteriores)</span>
                  </li>
                </ol>
                <p className="text-xs text-gray-500 flex items-start gap-1">
                  <Lightbulb className="h-3 w-3 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Tip: Seleccioná desde el primer trabajo hasta el último</span>
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Pegá aquí tu experiencia:</label>
              <Textarea
                value={data.experience}
                onChange={(e) => setData(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="Ejemplo:&#10;Desarrollador Full Stack&#10;Tech Company · Jornada completa&#10;ene. 2020 - actualidad · 4 años&#10;Buenos Aires, Argentina&#10;- Desarrollo de aplicaciones web con React y Node.js&#10;- Implementación de APIs RESTful..."
                className="min-h-[250px]"
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button
                onClick={() => handleNext("experience", data.experience)}
                disabled={!data.experience.trim()}
                className="bg-[#5D3A9B] hover:bg-[#4A2D7C]"
              >
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case "education":
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <h3 className="font-bold">Paso 3: Educación</h3>
              <div className="space-y-2 text-sm">
                <p className="font-semibold">Qué copiar de LinkedIn:</p>
                <ol className="space-y-1 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-[#5D3A9B] mt-0.5">•</span>
                    <span>Toda la sección "Educación"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5D3A9B] mt-0.5">•</span>
                    <span>Incluye: institución, título, fechas, descripción</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5D3A9B] mt-0.5">•</span>
                    <span>Copia todos tus estudios</span>
                  </li>
                </ol>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Pegá aquí tu educación:</label>
              <Textarea
                value={data.education}
                onChange={(e) => setData(prev => ({ ...prev, education: e.target.value }))}
                placeholder="Ejemplo:&#10;Universidad de Buenos Aires&#10;Licenciatura en Sistemas&#10;2015 - 2019&#10;&#10;Instituto Técnico&#10;Técnico en Programación&#10;2013 - 2015"
                className="min-h-[200px]"
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button
                onClick={() => handleNext("education", data.education)}
                className="bg-[#5D3A9B] hover:bg-[#4A2D7C]"
              >
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case "skills":
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <h3 className="font-bold">Paso 4: Habilidades</h3>
              <div className="space-y-2 text-sm">
                <p className="font-semibold">Qué copiar de LinkedIn:</p>
                <ol className="space-y-1 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-[#5D3A9B] mt-0.5">•</span>
                    <span>Toda la sección "Aptitudes" o "Skills"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5D3A9B] mt-0.5">•</span>
                    <span>Copia todas las habilidades que tengas listadas</span>
                  </li>
                </ol>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Pegá aquí tus habilidades:</label>
              <Textarea
                value={data.skills}
                onChange={(e) => setData(prev => ({ ...prev, skills: e.target.value }))}
                placeholder="Ejemplo:&#10;JavaScript&#10;React.js&#10;Node.js&#10;TypeScript&#10;SQL&#10;Git&#10;..."
                className="min-h-[200px]"
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button
                onClick={() => {
                  setData(prev => ({ ...prev, skills: data.skills }));
                  setCurrentStep("processing");
                }}
                className="bg-[#5D3A9B] hover:bg-[#4A2D7C]"
              >
                Procesar con IA
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case "processing":
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-bold text-lg">¡Datos recopilados!</h3>
                  <p className="text-sm text-gray-600">
                    Ahora la IA va a procesar tu información
                  </p>
                </div>
              </div>
              <div className="bg-white rounded p-4 space-y-2 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#5D3A9B]" />
                  La IA va a:
                </p>
                <ul className="space-y-1 ml-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Extraer y estructurar tus datos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Completar campos faltantes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Formatear fechas correctamente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Crear tu perfil optimizado para ATS</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack} disabled={processing}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button
                onClick={handleProcess}
                disabled={processing}
                className="bg-[#5D3A9B] hover:bg-[#4A2D7C]"
              >
                {processing ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Completar mi perfil
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Importar desde LinkedIn</DialogTitle>
          <DialogDescription>
            Paso {currentStep === "intro" ? 0 : currentStep === "basics" ? 1 : currentStep === "experience" ? 2 : currentStep === "education" ? 3 : currentStep === "skills" ? 4 : 5} de 5
          </DialogDescription>
        </DialogHeader>
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
}
