import { useEffect, useState } from "react";

export default function DarkModeToggle() {
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
      className="ml-4 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors text-white dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
      onClick={() => setDark((d) => !d)}
    >
      {dark ? "🌙" : "☀️"}
    </button>
  );
}
