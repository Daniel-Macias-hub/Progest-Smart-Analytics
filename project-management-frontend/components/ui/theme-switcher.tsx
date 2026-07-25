"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = theme === "system" ? resolvedTheme : theme
  const isDark = currentTheme === "dark" || currentTheme === "sunset"

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark"
    setTheme(nextTheme)

    if (typeof document !== "undefined") {
      const root = document.documentElement
      root.setAttribute("data-theme", nextTheme)
      root.style.colorScheme = nextTheme
      if (nextTheme === "dark") {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9 opacity-50 cursor-default">
        <Sun className="h-4 w-4" />
        <span className="sr-only">Cambiar tema</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
      className="w-9 h-9 rounded-full transition-transform active:scale-95 hover:bg-accent/50 focus-visible:ring-0"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-all duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 dark:text-amber-300 transition-all duration-300 rotate-0 scale-100" />
      )}
      <span className="sr-only">Cambiar a {isDark ? "Modo Claro" : "Modo Oscuro"}</span>
    </Button>
  )
}
