import { useState } from "react";
import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";

const links = [
  { href: "/#projects", label: "Projects" },
  { href: "/#resume", label: "Resume" },
  { href: "/#contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4">
      <nav className="w-full flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-md rounded-lg glass">
        <div className="text-xl font-bold text-shadow-lg text-[var(--foreground)]">
          Nicole Wert
        </div>
        <div className="hidden md:flex items-center gap-6 text-base">
          <ul className="flex gap-6 list-none m-0 p-0">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="no-underline text-[var(--foreground)] hover:text-[var(--primary)] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <DarkModeToggle />
        </div>
        <button
          className="md:hidden text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 z-50"
          onClick={toggleMenu}
        >
          <span
            className={`block w-4 h-0.5 bg-[var(--foreground)] mb-0.5 transition-transform duration-300 transform ${isOpen ? "rotate-45 translate-y-0.5" : ""}`}
          ></span>
          <span
            className={`block w-4 h-0.5 bg-[var(--foreground)] transition-transform duration-300 transform ${isOpen ? "-rotate-45 -translate-y-0.5" : ""}`}
          ></span>
        </button>
      </nav>
      {isOpen && (
        <div className="inset-0 bg-[var(--background)] flex flex-col items-center justify-center">
          <ul className="flex flex-col gap-8 list-none m-0 p-0 animate-fade-out">
            {links.map((link, index) => (
              <li key={link.href} className={`animate-slide-up delay-${index * 100}`}>
                <Link
                  href={link.href}
                  className="no-underline text-[var(--foreground)] hover:text-[var(--primary)] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <DarkModeToggle />
          </div>
        </div>
      )}
    </div>
  );
}
