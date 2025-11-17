import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/auth";
import { getUserProfileById } from "@/lib/queries";
import EditBioDialog from "@/components/EditBioDialog";
import EditPhoneDialog from "@/components/EditPhoneDialog";
import EditLocationDialog from "@/components/EditLocationDialog";
import EditProfileDialog from "@/components/EditProfileDialog";
import AddLinkDialog from "@/components/AddLinkDialog";
import EditLinkDialog from "@/components/EditLinkDialog";
import NoContentParagraph from "@/components/NoContentParagraph";
import EducationCard from "@/components/EducationCard";
import EducationDialog from "@/components/EducationDialog";
import SkillsPills from "@/components/SkillsPills";
import LanguageDialog from "@/components/LanguageDialog";
import LanguageCard from "@/components/LanguageCard";
import ExperienceDialog from "@/components/ExperienceDialog";
import ExperienceCard from "@/components/ExperienceCard";
import ProjectDialog from "@/components/ProjectDialog";
import ProjectCard from "@/components/ProjectCard";
import LinkedInImportButton from "@/components/LinkedInImportButton";
import ClearProfileButton from "@/components/ClearProfileButton";

export default async function ProfilePage() {
  const session = await auth();
  const profile = await getUserProfileById(session?.user?.id!);

  // Determinar si el perfil tiene contenido
  const hasContent = Boolean(
    profile.bio ||
      profile.phoneNumber ||
      profile.location ||
      profile.experiences?.length ||
      profile.educations?.length ||
      profile.skills?.length
  );

  return (
    <div className="mx-auto flex flex-col gap-6 my-[40px] max-w-[900px] px-4">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="w-32 h-32 border">
          <AvatarImage src={profile.profilePicture} />
          <AvatarFallback />
        </Avatar>

        <div className="flex gap-2 items-center">
          <h1 className="text-4xl">
            {profile.firstName} {profile.lastName}
          </h1>
          <div>
            <EditProfileDialog
              initialValue={{
                firstName: profile.firstName,
                lastName: profile.lastName,
                picture: profile.profilePicture,
              }}
            />
          </div>
        </div>

        {/* Botones de importar y limpiar */}
        <div className="flex gap-2">
          <LinkedInImportButton
            userId={session?.user?.id!}
            hasContent={hasContent}
          />
          {hasContent && <ClearProfileButton userId={session?.user?.id!} />}
        </div>
      </div>

      <Separator />

      <div className="flex flex-col justify-center gap-2">
        <div className="flex gap-2 justify-between">
          <h2 className="text-lg font-semibold">Biografía</h2>
          <EditBioDialog initialValue={profile.bio} />
        </div>
        {profile.bio ? (
          <p className="break-words">{profile.bio}</p>
        ) : (
          <NoContentParagraph />
        )}
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
        {profile.phoneNumber ? (
          <p className="break-words">{profile.phoneNumber}</p>
        ) : (
          <NoContentParagraph />
        )}
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <div className="flex gap-2 justify-between">
          <h2 className="text-lg font-semibold">Ubicación</h2>
          <EditLocationDialog initialValue={profile.location} />
        </div>
        {profile.location ? (
          <p className="break-words">{profile.location}</p>
        ) : (
          <NoContentParagraph />
        )}
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <div className="flex gap-2 justify-between">
          <h2 className="text-lg font-semibold">Experiencia</h2>
          <ExperienceDialog />
        </div>
        {profile.experiences.length > 0 ? (
          profile.experiences.map(
            ({
              id,
              title,
              company,
              endDate,
              startDate,
              description,
            }: {
              id: number;
              title: string;
              company: string;
              endDate: string;
              startDate: string;
              description: string;
            }) => (
              <div key={id} className="flex gap-2 justify-between">
                <ExperienceCard
                  title={title}
                  company={company}
                  startDate={startDate}
                  endDate={endDate}
                  description={description}
                />
                <ExperienceDialog
                  initialValue={{
                    id,
                    title,
                    company,
                    startDate,
                    endDate,
                    description,
                  }}
                />
              </div>
            )
          )
        ) : (
          <NoContentParagraph />
        )}
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <div className="flex gap-2 justify-between">
          <h2 className="text-lg font-semibold">Educación</h2>
          <EducationDialog />
        </div>
        {profile.educations.length > 0 ? (
          profile.educations.map(
            ({
              id,
              degree,
              school,
              endDate,
              startDate,
              description,
            }: {
              id: number;
              degree: string;
              school: string;
              endDate: string;
              startDate: string;
              description: string;
            }) => (
              <div key={id} className="flex gap-2 justify-between">
                <EducationCard
                  degree={degree}
                  school={school}
                  startDate={startDate}
                  endDate={endDate}
                  description={description}
                />
                <EducationDialog
                  initialValue={{
                    id,
                    degree,
                    school,
                    startDate,
                    endDate,
                    description,
                  }}
                />
              </div>
            )
          )
        ) : (
          <NoContentParagraph />
        )}
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <div className="flex gap-2 justify-between">
          <h2 className="text-lg font-semibold">Proyectos</h2>
          <ProjectDialog />
        </div>
        {profile.projects.length > 0 ? (
          profile.projects.map(
            ({
              id,
              name,
              endDate,
              startDate,
              description,
            }: {
              id: number;
              name: string;
              endDate: string;
              startDate: string;
              description: string;
            }) => (
              <div key={id} className="flex gap-2 justify-between">
                <ProjectCard
                  name={name}
                  startDate={startDate}
                  endDate={endDate}
                  description={description}
                />
                <ProjectDialog
                  initialValue={{
                    id,
                    name,
                    startDate,
                    endDate,
                    description,
                  }}
                />
              </div>
            )
          )
        ) : (
          <NoContentParagraph />
        )}
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
          <NoContentParagraph />
        )}
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <div className="flex gap-2 justify-between">
          <h2 className="text-lg font-semibold">Idiomas</h2>
          <LanguageDialog />
        </div>
        {profile.languages.length > 0 ? (
          profile.languages.map(
            ({
              id,
              name,
              proficiency,
            }: {
              id: number;
              name: string;
              proficiency?: string;
            }) => (
              <div key={id} className="flex gap-2 justify-between">
                <LanguageCard name={name} proficiency={proficiency} />
                <LanguageDialog initialValue={{ id, name, proficiency }} />
              </div>
            )
          )
        ) : (
          <NoContentParagraph />
        )}
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Habilidades</h2>
        <SkillsPills skills={profile.skills} />
      </div>
    </div>
  );
}
