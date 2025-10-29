import { auth } from "@/auth";

export default async function PotenciarPerfilPage() {
  const session = await auth();

  return (
    <div className="mx-auto flex flex-col gap-6 my-[40px] max-w-[1200px] px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Potenciar tu Perfil</h1>
          <p className="text-gray-600 mt-1">
            Recibí recomendaciones personalizadas de IA para mejorar tu perfil profesional
          </p>
        </div>
      </div>
    </div>
  );
}
