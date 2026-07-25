"use client"

import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import { ProjectThemeProvider } from "@/components/providers/project-theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider 
      attribute="data-theme" 
      defaultTheme="system" 
      enableSystem 
      themes={["light", "dark", "sunset", "sunrise", "barney", "slate", "candy", "firewatch", "citrus", "marsh", "frost"]}
      disableTransitionOnChange
    >
      <ProjectThemeProvider>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </ProjectThemeProvider>
    </ThemeProvider>
  )
}
