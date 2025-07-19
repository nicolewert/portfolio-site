'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import DarkModeToggle from './DarkModeToggle'
import { useTheme } from '../contexts/ThemeContext'

const links = [
  { href: '/#projects', label: 'Projects' },
  { href: '/#resume', label: 'Resume' },
  { href: '/#contact', label: 'Contact' },
  { href: '/blog', label: 'Blog' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY

      // Apply enhanced scroll lock
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }

    // Cleanup function to ensure scroll is restored when component unmounts
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [isOpen])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 pt-1">
      <div className="relative">
        <nav className="w-full flex items-center justify-between px-4 py-2 border-b border-white/10 backdrop-blur-md rounded-lg glass">
          <Link
            href="/"
            className="text-lg font-bold text-shadow-lg text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
          >
            Nicole Wert
          </Link>
          <div className="hidden md:flex items-center gap-4 text-sm">
            <ul className="flex gap-4 list-none m-0 p-0">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="no-underline text-[var(--foreground)] hover:text-[var(--primary)] transition-colors font-medium focus:outline-none"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <DarkModeToggle />
          </div>
        </nav>
        <button
          className={`absolute md:hidden text-[var(--foreground)] focus:outline-none z-50 transition-all duration-300 top-1/2 -translate-y-1/2 right-4`}
          onClick={toggleMenu}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          <div className="relative w-4 h-4 flex items-center justify-center">
            <span
              className={`absolute w-4 h-[0.1rem] bg-[var(--foreground)] transition-all duration-300 transform ${
                isOpen ? 'rotate-45' : 'translate-y-[-0.15rem]'
              }`}
            ></span>
            <span
              className={`absolute w-4 h-[0.1rem] bg-[var(--foreground)] transition-all duration-300 transform ${
                isOpen ? '-rotate-45' : 'translate-y-[0.15rem]'
              }`}
            ></span>
          </div>
        </button>
      </div>
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-screen h-[100dvh] z-40"
          style={{
            touchAction: 'none',
            backgroundColor:
              theme === 'dark'
                ? 'rgba(26, 34, 51, 0.85)'
                : 'rgba(219, 229, 245, 0.45)',
          }}
          onTouchMove={(e) => e.preventDefault()}
        >
          <div className="w-full h-full px-6 glass-fullscreen flex flex-col items-center justify-center backdrop-blur-md">
            <ul className="flex flex-col gap-8 list-none m-0 p-0 animate-fade-out text-center">
              {links.map((link, index) => (
                <li
                  key={link.href}
                  className={`animate-slide-up delay-${index * 100}`}
                >
                  <Link
                    href={link.href}
                    className="no-underline hover:!text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all duration-300 font-medium focus:outline-none text-lg px-6 py-3 rounded-lg block"
                    style={{ color: theme === 'dark' ? 'white' : 'black' }}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div
              className={`mt-8 animate-slide-up delay-${links.length * 100} flex justify-center`}
            >
              <DarkModeToggle mobile />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
