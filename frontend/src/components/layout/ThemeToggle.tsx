"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const themes = [
    { value: "light", icon: Sun },
    { value: "dark", icon: Moon },
    { value: "system", icon: Monitor },
  ];

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-border bg-muted p-0.5">
      {themes.map(({ value, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className="relative rounded-md p-1.5 transition-colors hover:text-foreground"
        >
          {theme === value && (
            <motion.div
              layoutId="theme-pill"
              className="absolute inset-0 rounded-md bg-background shadow-sm"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <Icon className="relative h-3.5 w-3.5 text-muted-foreground" />
        </button>
      ))}
    </div>
  );
}
