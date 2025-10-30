"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { 
  Sparkles, 
  RefreshCw, 
  BookOpen, 
  ExternalLink, 
  Code2, 
  TrendingUp,
  Clock,
  Target
} from "lucide-react";

interface Resource {
  title: string;
  url: string;
  type: string;
  duration: string;
}

interface Skill {
  name: string;
  reason: string;
  difficulty: string;
  resources: Resource[];
}

interface Project {
  title: string;
  description: string;
  technologies: string[];
  difficulty: string;
  estimatedTime: string;
  learningOutcomes: string[];
}

interface ProfileEnhancementProps {
  profile: any;
  userId: string;
}

export default function ProfileEnhancement({ profile, userId }: ProfileEnhancementProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<{
    skills: Skill[];
    projects: Project[];
  } | null>(null);

  // Load persisted data on mount
  useEffect(() => {
    if (profile.profileEnhancement) {
      setRecommendations(profile.profileEnhancement);
    }
  }, [profile.profileEnhancement]);

  const generateRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/enhance-profile", {
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
      setRecommendations(data);

      // Save to database
      const { updateProfileEnhancementAction } = await import("@/app/actions");
      await updateProfileEnhancementAction(userId, data);
    } catch (err) {
      console.error("Error:", err);
      setError("No se pudieron generar las recomendaciones");
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "principiante":
        return "bg-green-100 text-green-700 border-green-200";
      case "intermedio":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "avanzado":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "youtube":
        return "🎥";
      case "curso":
        return "📚";
      case "documentación":
        return "📄";
      case "tutorial":
        return "💡";
      case "artículo":
        return "📰";
      default:
        return "🔗";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-purple-50 rounded-lg border border-purple-200">
        <Spinner className="h-8 w-8 mb-4" />
        <p className="text-purple-700 font-medium">Generando recomendaciones personalizadas...</p>
        <p className="text-sm text-purple-600 mt-2">Esto puede tomar unos segundos</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-700 font-medium mb-4">{error}</p>
        <Button
          onClick={generateRecommendations}
          className="bg-[#5D3A9B] hover:bg-[#4A2D7C] text-white"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Intentar nuevamente
        </Button>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
        <TrendingUp className="h-16 w-16 text-purple-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Potenciá tu perfil</h3>
        <p className="text-gray-600 text-center mb-6 max-w-md">
          Obtené recomendaciones personalizadas de habilidades para aprender y proyectos para construir
        </p>
        <Button
          onClick={generateRecommendations}
          className="bg-[#5D3A9B] hover:bg-[#4A2D7C] text-white"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Generar recomendaciones
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botón regenerar */}
      <div className="flex justify-between items-center">
        <Button
          onClick={generateRecommendations}
          variant="outline"
          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 ml-auto"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Regenerar
        </Button>
      </div>

      {/* Skills Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-purple-600" />
          <h4 className="text-xl font-bold text-gray-900">Habilidades recomendadas</h4>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {recommendations.skills.map((skill, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h5 className="text-lg font-semibold text-gray-900">{skill.name}</h5>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(skill.difficulty)}`}>
                  {skill.difficulty}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{skill.reason}</p>
              
              {/* Resources */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-700 uppercase">Recursos gratuitos:</p>
                {skill.resources.map((resource, rIndex) => (
                  <a
                    key={rIndex}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-gray-50 hover:bg-purple-50 rounded border border-gray-200 hover:border-purple-300 transition-colors group"
                  >
                    <span className="text-lg">{getTypeIcon(resource.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-purple-700 truncate">
                        {resource.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{resource.type}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {resource.duration}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-purple-600" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Code2 className="h-5 w-5 text-purple-600" />
          <h4 className="text-xl font-bold text-gray-900">Proyectos sugeridos</h4>
        </div>
        <div className="grid gap-4">
          {recommendations.projects.map((project, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h5 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h5>
                  <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(project.difficulty)} ml-4`}>
                  {project.difficulty}
                </span>
              </div>

              {/* Technologies */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 uppercase mb-2">Tecnologías:</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, tIndex) => (
                    <span
                      key={tIndex}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Learning Outcomes */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 uppercase mb-2 flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Qué aprenderás:
                </p>
                <ul className="space-y-1">
                  {project.learningOutcomes.map((outcome, oIndex) => (
                    <li key={oIndex} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-purple-500 mt-0.5">•</span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Estimated Time */}
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Tiempo estimado: {project.estimatedTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
