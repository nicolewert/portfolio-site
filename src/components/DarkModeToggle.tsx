'use client'
import { useTheme } from '../contexts/ThemeContext'
import { BsSun, BsMoon } from 'react-icons/bs'

interface DarkModeToggleProps {
  mobile?: boolean
}

export default function DarkModeToggle({ mobile }: DarkModeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      aria-label={
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      }
      className={`${
        mobile ? 'w-12 h-12' : 'w-10 h-10'
      } rounded-full relative overflow-hidden transition-all duration-300 flex items-center justify-center text-[var(--foreground)] hover:text-[var(--primary)] focus:outline-none group`}
      onClick={toggleTheme}
    >
      {/* Circular hover highlight */}
      <div className="absolute inset-0 rounded-full bg-[var(--primary)] opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

      {/* Icon */}
      <div className="relative z-10">
        {theme === 'dark' ? (
          <BsSun className={`${mobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
        ) : (
          <BsMoon className={`${mobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
        )}
      </div>
    </button>
  )
}
