"use client"

import { useEffect, useRef, useState } from "react"

// ── Contenido de ProGest adaptado al modal ───────────────────────────────────
const MODAL_TITLE    = "Arquitectura de Gestión Integral"
const MODAL_VERSION  = "v001.progest-enterprise"
const MODAL_BODY_P1  = "Componentes estrictos para el control del ciclo de vida de cualquier proyecto o desarrollo corporativo. Cada módulo opera con permisos granulares, trazabilidad de cambios y sincronización en tiempo real."
const MODAL_BODY_P2  = "¿Deseas explorar el Dashboard de ProGest ahora mismo?"
const MODAL_CONFIRM_HREF = "/auth/register"



const TRIGGER_LETTERS = "EXPLORAR PROGEST".split("")

export function CyberModal() {
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState("")
  const [upgrading, setUpgrading] = useState(false)
  const [glitching, setGlitching] = useState(false)
  const glitchRef = useRef<HTMLDivElement>(null)

  const handleTrigger = () => {
    setUpgrading(true)
    setTimeout(() => {
      setUpgrading(false)
      setOpen(true)
      setTimeout(() => setGlitching(true), 1500)
    }, 1000)
  }

  const closeModal = (act: string) => {
    setAction(act)
    setTimeout(() => {
      setOpen(false)
      setAction("")
      setGlitching(false)
      if (act === "Proceed") window.location.href = MODAL_CONFIRM_HREF
    }, 250)
  }

  return (
    <>
      {/* ── Sección contenedor ─────────────────────────────────────────────── */}
      <section className="bg-background border-t">
        <div className="mx-auto max-w-[64rem] px-4 py-16 md:py-24 cyber-root">
          {/* Encabezado */}
          <div className="flex flex-col items-center text-center gap-4 mb-12">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium mb-2"
              style={{ color: "var(--accent)", borderColor: "var(--accent)", opacity: 0.8 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Sistema Activo — ProGest Enterprise
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Arquitectura de gestión integral
            </h2>
            <p className="max-w-[42rem] text-muted-foreground sm:text-lg">
              Componentes estrictos para el control del ciclo de vida de cualquier proyecto o desarrollo corporativo.
            </p>
          </div>

          {/* ── Cards de módulos ─────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {[
              { title: "Dashboard Inteligente",  desc: "Métricas en tiempo real, actividad reciente, tareas vencidas y progreso general." },
              { title: "Gestión de Tareas",      desc: "Crea, asigna y prioriza con niveles de urgencia, checklists y comentarios." },
              { title: "Board Kanban",           desc: "Arrastra y suelta tarjetas entre columnas para visualizar el flujo de trabajo." },
              { title: "Timeline / Gantt",       desc: "Visualiza fechas de inicio y vencimiento en una línea de tiempo con progreso." },
              { title: "Reportes y Analítica",   desc: "Gráficos de distribución por estado, prioridad y exportación a CSV." },
              { title: "Seguridad por Roles",    desc: "Control de acceso granular: cada usuario ve solo lo que le corresponde." },
            ].map((m) => (
              <div
                key={m.title}
                className="rounded-xl border p-5 bg-card hover:bg-muted/20 transition-colors cursor-default group relative overflow-hidden"
                style={{ borderColor: "hsl(var(--primary) / 0.2)" }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.08), transparent 70%)" }}
                />
                <h3
                  className="font-bold text-sm mb-2 uppercase tracking-wider"
                  style={{ fontFamily: "Cyber, sans-serif", color: "var(--accent)" }}
                >
                  {m.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
                <div
                  className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: "var(--accent)" }}
                />
              </div>
            ))}
          </div>

          {/* ── Trigger Zone ─────────────────────────────────────────────── */}
          <div className="relative mt-4 flex flex-col items-center gap-6">
            {/* Banner glassmorphism con borde accent */}
            <div
              className="relative w-full max-w-2xl overflow-hidden rounded-xl border px-8 py-6 text-center"
              style={{
                borderColor: "hsl(var(--primary) / 0.5)",
                background: "light-dark(hsl(0 0% 100% / 0.06), hsl(220 20% 5% / 0.6))",
                backdropFilter: "saturate(180%) blur(12px)",
                boxShadow: "0 0 40px hsl(var(--primary) / 0.15), inset 0 0 0 1px hsl(var(--primary) / 0.1)",
              }}
            >
              {/* Línea de escaneo animada */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-60"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%)",
                  animation: "cyber-scan 3s linear infinite",
                }}
              />
              {/* Corner decorativo */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: "var(--accent)" }} />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: "var(--accent)" }} />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: "var(--accent)" }} />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: "var(--accent)" }} />

              {/* Hint text */}
              <p
                className="mb-5 text-sm tracking-[0.2em] uppercase"
                style={{ fontFamily: "Cyber, sans-serif", color: "hsl(var(--primary) / 0.85)" }}
              >
                Presiona&nbsp;
                <span
                  className="inline-grid place-items-center rounded font-black text-xs"
                  style={{
                    width: "26px", height: "26px",
                    background: "var(--accent)",
                    color: "#000",
                    boxShadow: "0 0 12px var(--accent), 0 0 4px var(--accent)",
                    fontFamily: "Cyber, monospace",
                    verticalAlign: "middle",
                    letterSpacing: 0,
                  }}
                >U</span>
                &nbsp;o haz clic para explorar el producto
              </p>

              {/* Botón principal grande */}
              <button
                className={"cyber-btn cyber-glitch-btn cyber-root" + (upgrading ? " opacity-60" : "")}
                aria-label="Explorar ProGest"
                onClick={handleTrigger}
                style={{
                  fontSize: "1.1rem",
                  padding: "0.7rem 2.5rem",
                  minWidth: "220px",
                  letterSpacing: "0.15em",
                  boxShadow: "0 0 20px hsl(var(--primary) / 0.3)",
                }}
              >
                <span className="cyber-backdrop"><span className="cyber-corner" /></span>
                <kbd style={{ width: 28, height: 28, fontSize: 10 }}>E</kbd>
                <span>Explorar ProGest</span>
                {/* Glitch overlay */}
                <div className="cyber-btn-glitch" aria-hidden>
                  <span className="cyber-backdrop"><span className="cyber-corner" /></span>
                  <kbd style={{ opacity: 0, width: 28, height: 28 }}>E</kbd>
                  <span className="cyber-letters">
                    {TRIGGER_LETTERS.map((l, i) => <span key={i}>{l}</span>)}
                  </span>
                </div>
              </button>

              {/* Sub-hint */}
              <p
                className="mt-4 text-[10px] tracking-widest uppercase"
                style={{ color: "hsl(var(--primary) / 0.4)", fontFamily: "Cyber, sans-serif" }}
              >
                Sistema ProGest Enterprise — v1.0.0
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Modal cyberpunk ──────────────────────────────────────────────────── */}
      {open && (
        <div
          className={"cyber-modal-overlay cyber-root" + (action ? " closing" : "")}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal("Cancel") }}
          role="dialog"
          aria-modal="true"
          aria-label="Panel de arquitectura ProGest"
        >
          <div className="cyber-modal">
            {/* Cuerpo */}
            <div className="cyber-modal-body">
              <div className="cyber-body-backdrop" />
              <div className="cyber-modal-content">
                <div className="cyber-version">{MODAL_VERSION}</div>
                <h2><span>{MODAL_TITLE}</span></h2>
                <div>
                  <p>{MODAL_BODY_P1}</p>
                  <p>{MODAL_BODY_P2}</p>
                </div>
                {/* Capa glitch del contenido del modal */}
                <div
                  ref={glitchRef}
                  className={"cyber-modal-glitch" + (glitching ? " active" : "")}
                  aria-hidden
                >
                  <h2><span>{MODAL_TITLE}</span></h2>
                  <div>
                    <p>{MODAL_BODY_P1}</p>
                    <p>{MODAL_BODY_P2}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="cyber-modal-actions">
              <button
                className="cyber-btn cyber-root"
                aria-label="Cancelar"
                data-action="Cancel"
                onClick={() => closeModal("Cancel")}
              >
                <span className="cyber-backdrop"><span className="cyber-corner" /></span>
                <kbd>esc</kbd>
                <span>Cancelar</span>
              </button>
              <button
                autoFocus
                className="cyber-btn cyber-root"
                aria-label="Proceder"
                data-action="Proceed"
                onClick={() => closeModal("Proceed")}
              >
                <span className="cyber-backdrop"><span className="cyber-corner" /></span>
                <kbd>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 4v7a4 4 0 0 1-4 4H4" />
                    <path d="m9 10-5 5 5 5" />
                  </svg>
                </kbd>
                <span>Proceder</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
