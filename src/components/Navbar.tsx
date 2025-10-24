import Link from "next/link";
import NavLink from "./NavLink";
import Image from "next/image";
import { auth } from "../auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <header>
      <nav className="h-[60px] flex justify-between items-center w-full bg-[#5D3A9B] px-4">
        <Link href={"/"}>
          <Image
            src="/cvisto-nav.svg"
            alt="CVisto's logo"
            width={540}
            height={150}
            style={{ height: "40px", width: "auto" }}
            priority
          />
        </Link>
        {session ? (
          <div className="flex gap-[32px] items-center">
            <NavLink href="/job-scanner">Scanner</NavLink>
            <NavLink href="/cvs">CVs</NavLink>
            <DropdownMenu>
              <DropdownMenuTrigger
                id="navbar-dropdown-menu-trigger"
                className="cursor-pointer"
              >
                <Avatar>
                  <AvatarImage
                    src={session.user?.image || undefined}
                    alt="User's profile picture"
                  />
                  <AvatarFallback></AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link
                    href={"/profile"}
                    className="w-full px-2 cursor-pointer"
                  >
                    Mi perfil
                  </Link>
                </DropdownMenuItem>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/sign-in" });
                  }}
                >
                  <DropdownMenuItem asChild className="w-full px-2">
                    <button type="submit" className="cursor-pointer">
                      Cerrar sesión
                    </button>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <NavLink href="/sign-in">Acceder</NavLink>
        )}
      </nav>
    </header>
  );
}
