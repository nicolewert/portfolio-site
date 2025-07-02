import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-8 py-6 border-b border-white/20 backdrop-blur-md rounded-lg glass">
        <div className="text-2xl font-bold text-shadow-lg text-[var(--foreground)]">Nicole Wert</div>
        <div className="flex items-center gap-8 text-lg">
          <ul className="flex gap-8 list-none m-0 p-0">
            <li><Link href="#projects" className="icy-button no-underline px-4 py-2 rounded-lg hover:text-[var(--foreground)] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50">Projects</Link></li>
            <li><Link href="#resume" className="icy-button no-underline px-4 py-2 rounded-lg hover:text-[var(--foreground)] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50">Resume</Link></li>
            <li><Link href="#contact" className="icy-button no-underline px-4 py-2 rounded-lg hover:text-[var(--foreground)] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[var--primary)]/50">Contact</Link></li>
            <li><Link href="/blog" className="icy-button no-underline px-4 py-2 rounded-lg hover:text-[var(--foreground)] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50">Blog</Link></li>
          </ul>
          <DarkModeToggle />
        </div>
      </nav>
    </div>
  );
}
