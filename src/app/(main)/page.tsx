import Link from "next/link";
import LandingCard from "@/components/LandingCard";
import Dashboard from "@/components/Dashboard";
import { FileText, Palette, Target, Pencil, Search, Bot } from "lucide-react";
import { auth } from "../../auth";
import { getJobApplicationsByUserId, getUserProfileById } from "@/lib/queries";

const cards = [
  {
    icon: FileText,
    title: "Currículums ATS friendly",
    content:
      "Nos aseguramos que tu CV atraviese el Applicant Tracking System (ATS) con éxito gracias a un formato optimizado y al uso de palabras clave.",
  },
  {
    icon: Palette,
    title: "Customización a tu gusto",
    content:
      "Podrás personalizar tu CV a gusto para que logres darle tu impronta personal sin sacrificar calidad.",
  },
  {
    icon: Target,
    title: "Enfocados en un aviso",
    content:
      "Personalizamos tu CV a un aviso en particular para que logres aprovechar tus cualidades al máximo y destaques entre varios candidatos.",
  },
  {
    icon: Pencil,
    title: "Ingresá tus datos",
    content:
      "En tu perfil podrás cargar toda la información relevante que ayudará a la IA a conocerte mejor para poder generar el CV.",
  },
  {
    icon: Search,
    title: "Escanéa un aviso",
    content:
      "Deberás subir al sistema los detalles del aviso. Puedes hacerlo escribiendo, pegando su contenido o bien subiendo una imagen. La IA te dirá si calificas al empleo y detalles relevantes acerca de la empresa.",
  },
  {
    icon: Bot,
    title: "La IA generará tu CV",
    content:
      "Con toda la información disponible, se generará un CV profesional de acuerdo a los mejores estándares actuales. No volverás a preocuparte nunca más por ser rechazado.",
  },
];

export default async function HomePage() {
  const session = await auth();

  // Si el usuario está logueado, mostrar Dashboard
  if (session) {
    const applications = await getJobApplicationsByUserId(session.user?.id!);
    const profile = await getUserProfileById(session.user?.id!);
    
    // Verificar si el perfil está completo
    const profileComplete = !!(
      profile.bio &&
      profile.phoneNumber &&
      profile.location &&
      profile.experiences.length > 0 &&
      profile.educations.length > 0 &&
      profile.skills.length > 0
    );

    return (
      <Dashboard 
        userName={profile.firstName}
        applications={applications}
        profileComplete={profileComplete}
      />
    );
  }

  // Si no está logueado, mostrar Landing Page
  return (
    <div className="flex flex-col gap-12 items-center p-8">
      <div className="flex flex-col items-center gap-4 max-w-[900px] mt-[30px]">
        <h1 className="text-5xl text-center">
          Creá un CV que te ayude a destacar
        </h1>
        <p className="text-[18px] text-center">
          Obtené un CV profesional y ATS-friendly en minutos. Ingresá tus datos,
          escaneá un aviso y dejá que la IA haga el resto.
        </p>

        <Link
          href={session ? "/profile" : "/sign-in"}
          className="bg-[#5D3A9B] hover:bg-[#5D3A9B]/90 text-white p-3 rounded-full cursor-pointer"
        >
          Comenzar ahora
        </Link>
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-3xl text-center">Funcionalidades clave</h2>
        <div className="flex flex-col md:grid md:grid-cols-3 gap-6 lg:gap-12 mt-4">
          <LandingCard {...cards[0]} />
          <LandingCard {...cards[1]} />
          <LandingCard {...cards[2]} />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-3xl text-center">Cómo funciona</h2>
        <div className="flex flex-col md:grid md:grid-cols-3 gap-6 lg:gap-12 mt-4">
          <LandingCard {...cards[3]} />
          <LandingCard {...cards[4]} />
          <LandingCard {...cards[5]} />
        </div>
      </div>
    </div>
  );
}
