import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-md rounded-lg glass">
        <div className="text-xl font-bold text-shadow-lg text-[var(--foreground)]">Nicole Wert</div>
        <div className="flex items-center gap-6 text-base">
          <ul className="flex gap-6 list-none m-0 p-0">
            <li><Link href="#projects" className="no-underline text-[var(--foreground)] hover:text-[var(--primary)] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50">Projects</Link></li>
            <li><Link href="#resume" className="no-underline text-[var(--foreground)] hover:text-[var(--primary)] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50">Resume</Link></li>
            <li><Link href="#contact" className="no-underline text-[var(--foreground)] hover:text-[var(--primary)] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50">Contact</Link></li>
            <li><Link href="/blog" className="no-underline text-[var(--foreground)] hover:text-[var(--primary)] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50">Blog</Link></li>
          </ul>
          <DarkModeToggle />
        </div>
      </nav>
    </div>
  );
}
