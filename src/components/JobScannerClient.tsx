"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CheckCircle2,
  Sparkles,
  FileText,
  TrendingUp,
  TrendingDown,
  Lightbulb,
} from "lucide-react";
import { Profile } from "@/lib/queries";

interface AnalysisResult {
  keywords: string[];
  must_haves: string[];
  nice_to_haves: string[];
  gaps: string[];
  matchScore: number;
  summaryForRecruiter: string;
  suggestions: Array<{ text: string; category: string }>;
}

interface JobScannerClientProps {
  profile: Profile;
}

export default function JobScannerClient({ profile }: JobScannerClientProps) {
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!jobText.trim()) {
      setError("Por favor pegá el texto del aviso");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, jobText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Error al analizar");
      }

      setAnalysis(data);
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error ? err.message : "Error al analizar el aviso"
      );
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getMatchBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Textarea
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          placeholder={`Título: Desarrollador Full Stack\n\nUbicación: Buenos Aires, Argentina\n\nDescripción: Buscamos un desarrollador con experiencia en React y Node.js...\n\nRequisitos:\n- 3+ años de experiencia\n- TypeScript\n- etc.`}
          rows={15}
          className="resize-y min-h-[220px]"
          disabled={loading}
        />

        <div className="flex gap-2">
          <Button
            onClick={handleAnalyze}
            disabled={loading || !jobText.trim()}
            className="bg-[#5D3A9B] hover:bg-[#5D3A9B]/90 cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            {loading ? "Analizando..." : "Analizar aviso"}
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {analysis && (
        <>
          <Separator />

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-center">
              <div
                className={`flex flex-col items-center gap-2 p-8 rounded-xl ${getMatchBgColor(
                  analysis.matchScore
                )}`}
              >
                <span className="text-sm font-medium text-gray-600">
                  Tu Match Score
                </span>
                <span
                  className={`text-6xl font-bold ${getMatchColor(
                    analysis.matchScore
                  )}`}
                >
                  {analysis.matchScore}%
                </span>
                {analysis.matchScore >= 80 && (
                  <span className="text-sm text-green-700 font-medium">
                    ¡Excelente coincidencia!
                  </span>
                )}
                {analysis.matchScore >= 60 && analysis.matchScore < 80 && (
                  <span className="text-sm text-yellow-700 font-medium">
                    Buena coincidencia
                  </span>
                )}
                {analysis.matchScore < 60 && (
                  <span className="text-sm text-red-700 font-medium">
                    Necesitás mejorar algunas áreas
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">
                  Resumen para el Recruiter
                </h3>
              </div>
              <p className="text-gray-700">{analysis.summaryForRecruiter}</p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles />
                Palabras Clave del Aviso
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords && analysis.keywords.length > 0 ? (
                  analysis.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {kw}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No se encontraron palabras clave
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-900">
                    Requisitos Imprescindibles
                  </h3>
                </div>
                {analysis.must_haves && analysis.must_haves.length > 0 ? (
                  <ul className="space-y-2">
                    {analysis.must_haves.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">
                    No se encontraron requisitos imprescindibles
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">
                    Requisitos Deseables
                  </h3>
                </div>
                {analysis.nice_to_haves && analysis.nice_to_haves.length > 0 ? (
                  <ul className="space-y-2">
                    {analysis.nice_to_haves.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">
                    No se encontraron requisitos deseables
                  </p>
                )}
              </div>
            </div>

            {analysis.gaps && analysis.gaps.length > 0 ? (
              <div className="flex flex-col gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-red-900">
                    Brechas Identificadas
                  </h3>
                </div>
                <ul className="space-y-2">
                  {analysis.gaps.map((gap, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span className="text-gray-700">{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex flex-col gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-900">
                    Brechas Identificadas
                  </h3>
                </div>
                <p className="text-sm text-green-700 font-medium">
                  ¡Excelente! No se encontraron brechas significativas
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-900">
                  Sugerencias de Mejora
                </h3>
              </div>
              {analysis.suggestions && analysis.suggestions.length > 0 ? (
                <ul className="space-y-3">
                  {analysis.suggestions.map((sug, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded text-xs font-medium uppercase flex-shrink-0 mt-0.5">
                        {sug.category}
                      </span>
                      <span className="text-sm text-gray-700">{sug.text}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  No se encontraron sugerencias de mejora
                </p>
              )}
            </div>

            <Separator />

            <Button className="self-center bg-[#5D3A9B] hover:bg-[#5D3A9B]/90 cursor-pointer">
              <FileText />
              Generar CV Personalizado
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
