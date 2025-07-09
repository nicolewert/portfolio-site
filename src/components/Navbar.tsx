'use client'
import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function to ensure scroll is restored when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 pt-2">
      <nav className="w-full flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-md rounded-lg glass">
        <Link href="/" className="text-xl font-bold text-shadow-lg text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">
          Nicole Wert
        </Link>
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
      </nav>
      {isOpen && (
        <div
          className="absolute top-0 left-0 w-full h-screen z-40 px-6 glass-fullscreen flex flex-col items-center justify-center backdrop-blur-md bg-[var(--background)]"
        >
          <ul className="flex flex-col gap-8 list-none m-0 p-0 animate-fade-out">
            {links.map((link, index) => (
              <li key={link.href} className={`animate-slide-up delay-${index * 100}`}>
                <Link
                  href={link.href}
                  className="no-underline text-[var(--foreground)] hover:text-[var(--primary)] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className={`mt-8 animate-slide-up delay-${links.length * 100}`}>
            <DarkModeToggle mobile />
          </div>
        </div>
      )}
      <button
        className={`absolute md:hidden text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 z-50 transition-all duration-300 top-[38px] right-[52px]`}
        onClick={toggleMenu}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <div className="relative w-4 h-4 flex items-center justify-center">
          <span
            className={`absolute w-4 h-[0.1rem] bg-[var(--foreground)] transition-all duration-300 transform ${
              isOpen ? "rotate-45" : "translate-y-[-0.15rem]"
            }`}
          ></span>
          <span
            className={`absolute w-4 h-[0.1rem] bg-[var(--foreground)] transition-all duration-300 transform ${
              isOpen ? "-rotate-45" : "translate-y-[0.15rem]"
            }`}
          ></span>
        </div>
      </button>
    </div>
  );
}
