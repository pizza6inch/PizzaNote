"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

/** Both icons are in the markup; CSS shows the one for the active theme, so the server HTML is never wrong. */
export function ThemeToggle({ size, label }: { size: number; label: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label={label}
      className="masthead-link"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Moon size={size} aria-hidden="true" className="dark:hidden" />
      <Sun size={size} aria-hidden="true" className="hidden dark:block" />
    </button>
  );
}
