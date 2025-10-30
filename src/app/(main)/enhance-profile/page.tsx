import { auth } from "@/auth";
import { getUserProfileById } from "@/lib/queries";
import ProfileEnhancement from "@/components/ProfileEnhancement";

export default async function EnhanceProfilePage() {
  const session = await auth();
  const profile = await getUserProfileById(session?.user?.id!);

  return (
    <div className="mx-auto flex flex-col gap-6 my-[40px] max-w-[1200px] px-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">Potenciar Perfil</h1>
        <p className="text-muted-foreground">
          Descubrí nuevas habilidades para aprender y proyectos para construir basados en tu perfil actual
        </p>
      </div>

      <ProfileEnhancement profile={profile} userId={session?.user?.id!} />
    </div>
  );
}
