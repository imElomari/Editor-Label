"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/utils/theme-provider";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative w-9 h-9 rounded-full hover:bg-accent hover:text-accent-foreground"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 transition-all hover:rotate-45" />
      ) : (
        <Sun className="h-5 w-5 text-yellow-500 transition-all hover:rotate-45" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
