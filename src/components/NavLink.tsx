import Link from "next/link";
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  icon?: LucideIcon;
}

export default function NavLink({ href, children, icon: Icon }: NavLinkProps) {
  return (
    <Link href={href} className="text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </Link>
  );
}
