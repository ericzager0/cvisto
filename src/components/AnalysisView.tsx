"use client";

import { 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Lightbulb,
  FileText
} from "lucide-react";

interface AnalysisViewProps {
  analysis: {
    keywords?: string[];
    must_haves?: string[];
    nice_to_haves?: string[];
    gaps?: string[];
    matchScore?: number;
    summaryForRecruiter?: string;
    suggestions?: Array<{ text: string; category: string }>;
  };
}

export default function AnalysisView({ analysis }: AnalysisViewProps) {
  if (!analysis) {
    return null;
  }

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
    <div className="border rounded-lg p-6 bg-white shadow-sm space-y-6">
      {/* Match Score */}
      {analysis.matchScore !== undefined && (
        <div className={`flex flex-col items-center gap-2 p-6 rounded-xl ${getMatchBgColor(analysis.matchScore)}`}>
          <span className="text-sm font-medium text-gray-600">
            Tu Match Score
          </span>
          <span className={`text-5xl sm:text-6xl font-bold ${getMatchColor(analysis.matchScore)}`}>
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
              Necesita mejoras
            </span>
          )}
        </div>
      )}

      {/* Summary for Recruiter */}
      {analysis.summaryForRecruiter && (
        <div className="p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">
              Resumen para el Recruiter
            </h3>
          </div>
          <p className="text-gray-700">{analysis.summaryForRecruiter}</p>
        </div>
      )}

      {/* Keywords */}
      {analysis.keywords && analysis.keywords.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Palabras Clave del Aviso
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.keywords.map((kw, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {/* Must Haves */}
        {analysis.must_haves && analysis.must_haves.length > 0 && (
          <div className="flex flex-col gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-900">
                Requisitos Imprescindibles
              </h3>
            </div>
            <ul className="space-y-2">
              {analysis.must_haves.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Nice to Haves */}
        {analysis.nice_to_haves && analysis.nice_to_haves.length > 0 && (
          <div className="flex flex-col gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">
                Requisitos Deseables
              </h3>
            </div>
            <ul className="space-y-2">
              {analysis.nice_to_haves.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Gaps */}
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

      {/* Suggestions */}
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <div className="flex flex-col gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-900">
              Sugerencias de Mejora
            </h3>
          </div>
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
        </div>
      )}
    </div>
  );
}
