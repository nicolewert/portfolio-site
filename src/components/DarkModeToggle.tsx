import { useEffect, useState } from "react";

interface DarkModeToggleProps {
  mobile?: boolean;
}

export default function DarkModeToggle({ mobile }: DarkModeToggleProps) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <button
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`${
        mobile
          ? "px-4 py-2 w-full" 
          : "md:ml-4 md:mr-4 p-2"
      } rounded-full bg-white/20 hover:bg-white/40 transition-colors text-white dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center gap-2 ${
        mobile ? "justify-center" : ""
      }`}
      onClick={() => {
        setDark((d) => !d);
      }}
    >
      {dark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
