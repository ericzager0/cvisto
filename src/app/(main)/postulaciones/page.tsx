import { auth } from "@/auth";
import { getJobApplicationsByUserId, getUserProfileById } from "@/lib/queries";
import PostulacionesClient from "@/components/PostulacionesClient";

export default async function PostulacionesPage() {
  const session = await auth();
  const applications = await getJobApplicationsByUserId(session?.user?.id!);
  const profile = await getUserProfileById(session?.user?.id!);

  return (
    <div className="mx-auto flex flex-col gap-6 my-[40px] max-w-[1200px] px-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">Postulaciones</h1>
        <p className="text-muted-foreground">
          Gestioná tus aplicaciones y buscá nuevas oportunidades laborales
        </p>
      </div>

      <PostulacionesClient 
        initialApplications={applications}
        userId={session?.user?.id!}
        profile={profile}
      />
    </div>
  );
}
