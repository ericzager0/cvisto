import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/auth";
import { getUserProfileById } from "@/lib/queries";
import EditBioDialog from "@/components/EditBioDialog";
import EditPhoneDialog from "@/components/EditPhoneDialog";
import EditLocationDialog from "@/components/EditLocationDialog";
import EditProfileDialog from "@/components/EditProfileDialog";
import CreateEducationDialog from "@/components/CreateEducationDialog";
import AddLinkDialog from "@/components/AddLinkDialog";
import EditLinkDialog from "@/components/EditLinkDialog";

export default async function ProfilePage() {
  const session = await auth();
  const profile = await getUserProfileById(session?.user?.id!);

  return (
    <div className="mx-auto flex flex-col gap-4 my-[40px] max-w-[900px] px-4">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="w-32 h-32 border">
          <AvatarImage src={profile.profilePicture} />
          <AvatarFallback />
        </Avatar>

        <div className="flex gap-2">
          <h1 className="text-4xl">
            {profile.firstName} {profile.lastName}
          </h1>
          <EditProfileDialog
            initialValue={{
              firstName: profile.firstName,
              lastName: profile.lastName,
              picture: profile.profilePicture,
            }}
          />
        </div>
      </div>

      <Separator />

      <div className="flex flex-col justify-center gap-2">
        <div className="flex gap-2 justify-between">
          <h2 className="text-lg font-semibold">Biografía</h2>
          <EditBioDialog initialValue={profile.bio} />
        </div>
        <p className="break-words">
          {profile.bio ? profile.bio : "Aún no has proporcionado información."}
        </p>
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Correo electrónico</h2>
        <p>{profile.email}</p>
      </div>
      <Separator />

      <div className="flex flex-col gap-2">
        <div className="flex gap-2 justify-between">
          <h2 className="text-lg font-semibold">Teléfono</h2>
          <EditPhoneDialog initialValue={profile.phoneNumber} />
        </div>
        <p>{profile.phoneNumber ? profile.phoneNumber : "Sin teléfono"}</p>
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <div className="flex gap-2 justify-between">
          <h2 className="text-lg font-semibold">Ubicación</h2>
          <EditLocationDialog initialValue={profile.location} />
        </div>
        <p>{profile.location ? profile.location : "Sin ubicación"}</p>
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <div className="flex gap-2 justify-between">
          <h2 className="text-lg font-semibold">Educación</h2>
          <CreateEducationDialog />
        </div>
        <p>Todavía no proporcionaste información.</p>
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <div className="flex gap-2 justify-between">
          <h2 className="text-lg font-semibold">Enlaces</h2>
          <AddLinkDialog />
        </div>
        {profile.links.length > 0 ? (
          profile.links.map(({ id, link }: { id: number; link: string }) => (
            <div key={id} className="flex gap-2 justify-between">
              <p>{link}</p>
              <EditLinkDialog linkId={id} link={link} />
            </div>
          ))
        ) : (
          <p>No hay links disponibles</p>
        )}
      </div>
    </div>
  );
}
