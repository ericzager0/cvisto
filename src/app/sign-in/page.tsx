import Link from "next/link";
import Image from "next/image";
import SignIn from "@/components/sign-in/SignIn";

export default function LoginPage() {
  return (
    <>
      <header className="flex justify-center mt-[40px]">
        <Link href={"/"}>
          <Image
            src={"cvisto.svg"}
            alt="CVisto's logo"
            width={600}
            height={150}
            style={{ width: "300px", height: "auto" }}
            priority
          />
        </Link>
      </header>
      <main className="flex justify-center mt-[20px]">
        <div className="flex flex-col gap-1 border border-[#d5d9d9] p-4 rounded-lg">
          <h1 className="text-3xl">Acceder</h1>
          <p className="text-[#565959]">
            Accedé con Google para empezar a usar tu cuenta profesional.
          </p>
          <SignIn />
        </div>
      </main>
    </>
  );
}
