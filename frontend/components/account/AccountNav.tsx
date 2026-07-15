"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/auth/actions";

const LINKS: [string, string][] = [
  ["/account", "Overview"],
  ["/account/orders", "Orders"],
  ["/account/addresses", "Addresses"],
  ["/account/details", "Account details"],
];

export default function AccountNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/account" ? pathname === "/account" : pathname.startsWith(href);

  return (
    <nav className="acct-nav" aria-label="Account">
      {LINKS.map(([href, label]) => (
        <Link key={href} href={href} className={isActive(href) ? "active" : undefined}>
          {label}
        </Link>
      ))}
      <form action={logoutAction}>
        <button type="submit" className="acct-nav-logout">
          Sign out
        </button>
      </form>
    </nav>
  );
}
