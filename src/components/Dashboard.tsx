import Link from "next/link";
import {
  FileText,
  Briefcase,
  ScanSearch,
  Sparkles,
  TrendingUp,
  Calendar,
  Clock,
  Lightbulb,
} from "lucide-react";

interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  status:
    | "applied"
    | "phone_screen"
    | "interview"
    | "technical_test"
    | "offer"
    | "rejected"
    | "withdrawn";
  appliedDate: string;
}

interface DashboardProps {
  userName: string;
  applications: JobApplication[];
  profileComplete: boolean;
}

export default function Dashboard({
  userName,
  applications,
  profileComplete,
}: DashboardProps) {
  const recentApplications = applications.slice(0, 3);

  const statusColors: Record<string, string> = {
    applied: "bg-purple-100 text-purple-700 border-purple-200",
    phone_screen: "bg-blue-100 text-blue-700 border-blue-200",
    interview: "bg-blue-100 text-blue-700 border-blue-200",
    technical_test: "bg-yellow-100 text-yellow-700 border-yellow-200",
    offer: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    withdrawn: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const statusLabels: Record<string, string> = {
    applied: "Aplicado",
    phone_screen: "Llamada",
    interview: "Entrevista",
    technical_test: "Evaluación",
    offer: "Oferta",
    rejected: "Rechazado",
    withdrawn: "Retirado",
  };

  return (
    <div className="mx-auto flex flex-col gap-8 my-[40px] max-w-[1200px] px-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">¡Hola, {userName}!</h1>
        <p className="text-muted-foreground text-lg">
          Bienvenido a tu panel de control profesional
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">
                Postulaciones
              </p>
              <p className="text-3xl font-bold text-purple-900">
                {applications.length}
              </p>
            </div>
            <Briefcase className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">En proceso</p>
              <p className="text-3xl font-bold text-blue-900">
                {
                  applications.filter(
                    (a) =>
                      a.status === "interview" || a.status === "phone_screen"
                  ).length
                }
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Esta semana</p>
              <p className="text-3xl font-bold text-orange-900">
                {
                  applications.filter((a) => {
                    const appDate = new Date(a.appliedDate);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return appDate >= weekAgo;
                  }).length
                }
              </p>
            </div>
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Alert si perfil incompleto */}
      {!profileComplete && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="bg-yellow-400 rounded-full p-1">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-yellow-800">
                Completá tu perfil
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Tu perfil está incompleto. Agregá más información para que la IA
                pueda generar mejores recomendaciones.
              </p>
              <Link
                href="/profile"
                className="inline-block mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
              >
                Completar ahora →
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Accesos Rápidos */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Accesos Rápidos</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/profile"
              className="bg-white border-2 border-gray-200 hover:border-[#5D3A9B] hover:bg-purple-50 rounded-lg p-4 transition-all group"
            >
              <FileText className="w-8 h-8 text-[#5D3A9B] mb-2" />
              <p className="font-semibold group-hover:text-[#5D3A9B]">
                Mi Perfil
              </p>
              <p className="text-xs text-muted-foreground">
                Editar información
              </p>
            </Link>

            <Link
              href="/job-scanner"
              className="bg-white border-2 border-gray-200 hover:border-[#5D3A9B] hover:bg-purple-50 rounded-lg p-4 transition-all group"
            >
              <ScanSearch className="w-8 h-8 text-[#5D3A9B] mb-2" />
              <p className="font-semibold group-hover:text-[#5D3A9B]">
                Scanner
              </p>
              <p className="text-xs text-muted-foreground">Analizar ofertas</p>
            </Link>

            <Link
              href="/postulaciones"
              className="bg-white border-2 border-gray-200 hover:border-[#5D3A9B] hover:bg-purple-50 rounded-lg p-4 transition-all group"
            >
              <Briefcase className="w-8 h-8 text-[#5D3A9B] mb-2" />
              <p className="font-semibold group-hover:text-[#5D3A9B]">
                Postulaciones
              </p>
              <p className="text-xs text-muted-foreground">
                Gestionar aplicaciones
              </p>
            </Link>

            <Link
              href="/enhance-profile"
              className="bg-white border-2 border-gray-200 hover:border-[#5D3A9B] hover:bg-purple-50 rounded-lg p-4 transition-all group"
            >
              <Sparkles className="w-8 h-8 text-[#5D3A9B] mb-2" />
              <p className="font-semibold group-hover:text-[#5D3A9B]">
                Potenciar
              </p>
              <p className="text-xs text-muted-foreground">Mejorar perfil</p>
            </Link>
          </div>
        </div>

        {/* Postulaciones Recientes */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Postulaciones Recientes</h2>
            <Link
              href="/postulaciones"
              className="text-sm text-[#5D3A9B] hover:underline"
            >
              Ver todas →
            </Link>
          </div>

          {recentApplications.length > 0 ? (
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-[#5D3A9B] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{app.jobTitle}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {app.company}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(app.appliedDate).toLocaleDateString("es-AR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded border whitespace-nowrap ${
                        statusColors[app.status] ||
                        "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {statusLabels[app.status] || app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center h-full flex flex-col items-center justify-center">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">
                No tenés postulaciones aún
              </p>
              <Link
                href="/postulaciones"
                className="inline-block text-sm text-[#5D3A9B] hover:underline"
              >
                Comenzar a buscar ofertas →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Tips y Sugerencias */}
      <div className="bg-gradient-to-r from-[#5D3A9B] to-[#4A2D7C] rounded-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
          <Lightbulb className="w-6 h-6" />
          Consejo del día
        </h3>
        <p className="opacity-90 mb-4">
          Personalizá tu CV para cada oferta usando el Scanner. Los CVs
          adaptados tienen 40% más probabilidades de pasar los filtros ATS.
        </p>
        <div className="flex gap-3">
          <Link
            href="/job-scanner"
            className="bg-white text-[#5D3A9B] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
          >
            Escanear oferta
          </Link>
          <Link
            href="/info"
            className="bg-[#4A2D7C] px-4 py-2 rounded-lg font-semibold hover:bg-[#3d2566] transition-colors border border-white/30 text-sm"
          >
            Más info sobre ATS
          </Link>
        </div>
      </div>
    </div>
  );
}
