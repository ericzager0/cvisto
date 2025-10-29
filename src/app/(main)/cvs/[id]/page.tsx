import { auth } from "@/auth";
import { getCVById } from "@/lib/queries";
import { notFound, redirect } from "next/navigation";
import { Download, Edit, Trash2, Calendar, Image, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DeleteCVButton from "@/components/DeleteCVButton";

export default async function CVPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const { id } = await params;
  const cv = await getCVById(id);

  if (!cv) {
    notFound();
  }

  // Verificar que el CV pertenezca al usuario
  if (cv.userId !== session.user.id) {
    notFound();
  }

  const formattedDate = new Date(cv.createdTimestamp).toLocaleDateString(
    "es-AR",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div className="mx-auto flex flex-col gap-6 my-[40px] max-w-[800px] px-4">
      {/* Header con botón volver */}
      <div className="flex items-center gap-2">
        <Link
          href="/cvs"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Volver a Mis CVs
        </Link>
      </div>

      {/* Tarjeta principal */}
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        {/* Título y acciones */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#5D3A9B]/10 rounded-lg">
              <FileText className="h-8 w-8 text-[#5D3A9B]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{cv.title}</h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Creado el {formattedDate}
              </p>
            </div>
          </div>
        </div>

        {/* Características */}
        <div className="flex flex-col gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold text-gray-900">Características</h2>
          <div className="flex items-center gap-2 text-gray-700">
            <Image className="h-4 w-4" />
            <span className="font-medium">
              {cv.hasPhoto ? "CON FOTO" : "SIN FOTO"}
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-wrap gap-3">
          <a
            href={cv.url}
            download
            className="inline-flex items-center justify-center gap-2 h-10 px-4 py-2 bg-[#5D3A9B] hover:bg-[#5D3A9B]/90 text-white rounded-md text-sm font-medium transition-all"
          >
            <Download className="h-4 w-4" />
            Descargar CV
          </a>

          <Button
            variant="outline"
            disabled
            className="opacity-50 cursor-not-allowed"
          >
            <Edit className="h-4 w-4" />
            Editar (Próximamente)
          </Button>

          <DeleteCVButton cvId={cv.id} cvTitle={cv.title} />
        </div>
      </div>

      {/* Información adicional */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-2">Información</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium">ID:</span> {cv.id}
          </p>
          <p>
            <span className="font-medium">Última modificación:</span>{" "}
            {new Date(cv.modifiedTimestamp).toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
