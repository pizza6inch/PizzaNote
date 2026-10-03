"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle({ size, label }: { size: number; label: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label={label}
      className=" hover:bg-primary transition-all rounded-lg p-2"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Sun size={size} /> : <Moon size={size} />}
    </button>
  );
}
