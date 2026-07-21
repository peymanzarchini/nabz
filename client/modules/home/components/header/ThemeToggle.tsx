/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  isMobile?: boolean;
}

const ThemeToggle = ({ isMobile = false }: ThemeToggleProps) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const sizeClass = isMobile ? "w-12 h-12 border border-border/30" : "w-11 h-11 hover:scale-110";
  const iconSize = isMobile ? "h-5 w-5" : "h-6 w-6";

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={`relative ${sizeClass} rounded-full flex items-center justify-center transition-all duration-500 group cursor-pointer shrink-0`}
      aria-label="تغییر تم"
    >
      <span
        className={`absolute inset-0 rounded-full backdrop-blur-sm transition-all duration-500 ${
          resolvedTheme === "dark"
            ? "bg-linear-to-tr from-yellow-400/20 to-orange-500/20 group-hover:shadow-lg group-hover:shadow-yellow-500/30"
            : "bg-linear-to-tr from-indigo-400/20 to-blue-500/20 group-hover:shadow-lg group-hover:shadow-blue-500/30"
        }`}
      ></span>
      {resolvedTheme === "dark" ? (
        <Sun
          className={`${iconSize} text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] transition-transform duration-500 group-hover:rotate-45 relative z-10`}
        />
      ) : (
        <Moon
          className={`${iconSize} text-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0.5)] transition-transform duration-500 group-hover:-rotate-12 relative z-10`}
        />
      )}
    </button>
  );
};

export default ThemeToggle;
