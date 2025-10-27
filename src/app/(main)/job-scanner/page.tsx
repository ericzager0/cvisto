import { auth } from "@/auth";
import { getUserProfileById } from "@/lib/queries";
import JobScannerClient from "@/components/JobScannerClient";

export default async function JobScannerPage() {
  const session = await auth();
  const profile = await getUserProfileById(session?.user?.id!);

  return (
    <div className="mx-auto flex flex-col gap-6 my-[40px] max-w-[1200px] px-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">Escanear aviso de trabajo</h1>
        <p className="text-muted-foreground">
          Pegá el texto completo del aviso de trabajo y descubrí qué tan bien
          coincide con tu perfil.
        </p>
      </div>

      <JobScannerClient profile={profile} />
    </div>
  );
}
