import { CV } from "@/lib/queries";
import { FileText, Calendar, Image } from "lucide-react";
import Link from "next/link";

interface CVCardProps {
  cv: CV;
}

export default function CVCard({ cv }: CVCardProps) {
  const formattedDate = new Date(cv.createdTimestamp).toLocaleDateString(
    "es-AR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );

  return (
    <Link
      href={`/cvs/${cv.id}`}
      className="group flex flex-col gap-3 p-4 border rounded-lg hover:shadow-md transition-all hover:border-[#5D3A9B] bg-white"
    >
      {/* Icono y título */}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-[#5D3A9B]/10 rounded-lg group-hover:bg-[#5D3A9B]/20 transition-colors">
          <FileText className="h-5 w-5 text-[#5D3A9B]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate group-hover:text-[#5D3A9B] transition-colors">
            {cv.title}
          </h3>
        </div>
      </div>

      {/* Información adicional */}
      <div className="flex flex-col gap-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
        {cv.hasPhoto && (
          <div className="flex items-center gap-2 text-[#5D3A9B]">
            <Image className="h-4 w-4" />
            <span className="text-xs">Con foto</span>
          </div>
        )}
      </div>
    </Link>
  );
}
