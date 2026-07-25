"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/stores/authStore"

export function ProjectThemeProvider({ children }: { children: React.ReactNode }) {
  const session = useAuthStore((s) => s.session)
  const hydrated = useAuthStore((s) => s.hydrated)

  useEffect(() => {
    if (!hydrated) return

    // 1. Obtener preferencia de tema desde session project, user o localStorage
    const projectTheme = 
      session?.project?.preferred_theme || 
      session?.user?.preferred_theme || 
      localStorage.getItem("progest_project_theme") || 
      "barney"

    // 2. Aplicar el tema en el elemento html sin afectar light/dark mode
    document.documentElement.setAttribute("data-project-theme", projectTheme.toLowerCase())
    localStorage.setItem("progest_project_theme", projectTheme.toLowerCase())
  }, [session, hydrated])

  return <>{children}</>
}
