import Link from "next/link";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  return (
    <Link href={href} className="text-white">
      {children}
    </Link>
  );
}
