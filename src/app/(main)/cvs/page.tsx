import AddCVDialog from "@/components/AddCVDialog";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";
import Link from "next/link";

export default function CVsPage() {
  const cvs = [];

  return (
    <div className="mx-auto flex flex-col gap-4 my-[40px] max-w-[1200px] px-4">
      <h1 className="text-4xl">Mis CVs</h1>
      {cvs.length === 0 ? (
        <div className="flex flex-col border rounded-lg items-center justify-center p-8 gap-3">
          <div className="bg-[#F5F5F5] p-2 rounded-lg">
            <FolderOpen />
          </div>

          <span className="text-lg font-medium">
            Todavía no tenés ningún CV
          </span>
          <p className="text-muted-foreground text-center">
            Podés generar tu CV automáticamente escaneando un aviso, o subir uno
            que ya tengas.
          </p>

          <div className="flex gap-4">
            <Link
              href="/job-scanner"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs dark:bg-input/30 dark:border-input h-9 px-4 py-2 has-[>svg]:px-3 bg-[#5D3A9B] hover:bg-[#5D3A9B]/90 cursor-pointer text-white"
            >
              Generar CV
            </Link>
            <AddCVDialog variant="outline" />
          </div>
        </div>
      ) : (
        <AddCVDialog variant="fixed" />
      )}
    </div>
  );
}
