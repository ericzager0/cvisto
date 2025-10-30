"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Sparkles, RefreshCw } from "lucide-react";

interface RecommendedPositionsProps {
  initialPositions: string[] | null;
  profile: any;
  onPositionClick: (position: string) => void;
  onRegenerate: (positions: string[]) => void;
}

export default function RecommendedPositions({
  initialPositions,
  profile,
  onPositionClick,
  onRegenerate,
}: RecommendedPositionsProps) {
  // Normalizar initialPositions: si es string, parsearlo; si es array, usarlo; si es null, null
  const normalizedPositions = (() => {
    if (!initialPositions) return null;
    if (Array.isArray(initialPositions)) return initialPositions;
    if (typeof initialPositions === 'string') {
      try {
        const parsed = JSON.parse(initialPositions);
        return Array.isArray(parsed) ? parsed : null;
      } catch {
        return null;
      }
    }
    return null;
  })();

  const [positions, setPositions] = useState<string[] | null>(normalizedPositions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePositions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/recommend-positions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error del servidor:", errorData);
        throw new Error(errorData.error || "Error al generar recomendaciones");
      }

      const data = await response.json();
      setPositions(data.positions);
      onRegenerate(data.positions);
    } catch (err) {
      console.error("Error:", err);
      setError("No se pudieron generar las recomendaciones");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-purple-50 rounded-lg border border-purple-200">
        <Spinner className="h-6 w-6 mr-2" />
        <span className="text-purple-700">Generando recomendaciones con IA...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-700 text-sm mb-3">{error}</p>
        <Button
          onClick={generatePositions}
          variant="outline"
          size="sm"
          className="text-red-700 border-red-300 hover:bg-red-100"
        >
          Intentar nuevamente
        </Button>
      </div>
    );
  }

  if (!positions || positions.length === 0) {
    return (
      <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-purple-900">
                Recomendaciones personalizadas
              </h3>
            </div>
            <p className="text-sm text-purple-700 mb-4">
              Dejá que la IA analice tu perfil y te recomiende los mejores puestos para vos
            </p>
            <Button
              onClick={generatePositions}
              className="bg-[#5D3A9B] hover:bg-[#4A2D7C] text-white"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generar recomendaciones
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-purple-900">
            Puestos recomendados para vos
          </h3>
        </div>
        <Button
          onClick={generatePositions}
          variant="outline"
          size="sm"
          className="shrink-0 border-purple-300 hover:bg-purple-100"
          disabled={loading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Regenerar
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {positions.map((position, index) => (
          <Button
            key={index}
            onClick={() => onPositionClick(position)}
            variant="outline"
            className="bg-white hover:bg-purple-50 border-purple-300 text-purple-900 hover:border-purple-400"
          >
            {position}
          </Button>
        ))}
      </div>

      <p className="text-xs text-purple-600 mt-3">
        💡 Click en cualquier puesto para buscar ofertas relacionadas
      </p>
    </div>
  );
}
