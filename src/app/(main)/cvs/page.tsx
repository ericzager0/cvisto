import { auth } from "@/auth";
import AddCVDialog from "@/components/AddCVDialog";
import { Button } from "@/components/ui/button";
import { getCVsByUserId, getTotalCVsByUserId } from "@/lib/queries";
import { FolderOpen } from "lucide-react";
import Link from "next/link";
import CVCard from "@/components/CVCard";
import Pagination from "@/components/Pagination";

export default async function CVsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const limit = 12;

  const cvs = await getCVsByUserId(
    session?.user?.id as string,
    currentPage,
    limit
  );
  const totalCVs = await getTotalCVsByUserId(session?.user?.id as string);
  const totalPages = Math.ceil(totalCVs / limit);

  return (
    <div className="mx-auto flex flex-col gap-6 my-[40px] max-w-[1200px] px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Mis CVs</h1>
          {totalCVs > 0 && (
            <p className="text-gray-600 mt-1">
              {totalCVs} {totalCVs === 1 ? "CV" : "CVs"} en total
            </p>
          )}
        </div>
        {cvs.length > 0 && (
          <div className="flex gap-2">
            <Link
              href="/job-scanner"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 bg-[#5D3A9B] hover:bg-[#5D3A9B]/90 text-white"
            >
              Generar CV
            </Link>
            <AddCVDialog variant="outline" />
          </div>
        )}
      </div>

      {cvs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 gap-4 border rounded-lg bg-gray-50">
          <div className="bg-white p-4 rounded-full shadow-sm">
            <FolderOpen className="h-12 w-12 text-gray-400" />
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Todavía no tenés ningún CV
            </h2>
            <p className="text-gray-600 max-w-md">
              Podés generar uno automáticamente escaneando un aviso, o bien
              subir alguno que ya tengas.
            </p>
          </div>

          <div className="flex gap-3 mt-2">
            <Link
              href="/job-scanner"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-10 px-6 bg-[#5D3A9B] hover:bg-[#5D3A9B]/90 text-white"
            >
              Generar CV
            </Link>
            <AddCVDialog variant="outline" />
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cvs.map((cv) => (
              <CVCard key={cv.id} cv={cv} />
            ))}
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
