"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { IridescentButton } from "@/components/ui/iridescent-button"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"
import { useState, useRef } from "react"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"

const links = [
  { label: "Producto",  href: "/product"  },
  { label: "Planes",    href: "/plans"    },
  { label: "Seguridad", href: "/security" },
  { label: "FAQ",       href: "/faq"      },
  { label: "Contacto",  href: "/contact"  },
  { label: "Acerca de", href: "/about"    },
]

export function MarketingHeader() {
  const pathname   = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Encuentra el índice activo para asignar el anchor-name CSS correctamente
  const activeIndex = links.findIndex((l) => pathname === l.href)

  return (
    <>


      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 gap-4">

          {/* Logo animado aurora ── ProGestLogoHeader */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Logo size={40} />
          </Link>

          {/* Navegación central con pill animada */}
          <nav className="hidden md:flex flex-1 items-center justify-center overflow-hidden">
            <ul className="progest-nav-list">
              {links.map((l, i) => {
                const isActive = pathname === l.href
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="progest-nav-link"
                      data-active={isActive ? "true" : undefined}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span>{l.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Acciones: tema + auth con botones iridiscentes */}
          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <ThemeSwitcher />
            <Link href="/auth/login">
              <IridescentButton variant="ghost" size="sm">Iniciar Sesion</IridescentButton>
            </Link>
            <Link href="/auth/register">
              <IridescentButton variant="default" size="sm">Comenzar Gratis</IridescentButton>
            </Link>
          </div>

          {/* Menú móvil */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Panel móvil */}
        {mobileOpen && (
          <div className="border-t bg-background px-4 py-3 md:hidden">
            <nav className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    pathname === l.href
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex w-full items-center justify-between px-3 py-1.5 rounded-md border border-border">
                <span className="text-sm font-medium">Tema Visual</span>
                <ThemeSwitcher />
              </div>
              <Link href="/auth/login"><Button variant="outline" className="w-full" size="sm">Iniciar Sesion</Button></Link>
              <Link href="/auth/register"><Button className="w-full" size="sm">Comenzar Gratis</Button></Link>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
