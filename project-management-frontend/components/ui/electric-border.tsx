"use client"

import React, { useId } from "react"
import { cn } from "@/lib/utils"



interface ElectricBorderProps {
  children: React.ReactNode
  className?: string
  innerClassName?: string
}

/**
 * ElectricBorder - Versión DRAMÁTICA.
 * Implementa un efecto líquido/eléctrico mediante filtros SVG complejos y capas de brillo.
 * Basado en la referencia aportada por el usuario (Vladimir/FreeFrontend).
 */
export function ElectricBorder({
  children,
  className,
  innerClassName,
}: ElectricBorderProps) {
  const id = useId().replace(/:/g, "")

  return (
    <div className={cn("relative inline-flex items-center justify-center pt-1 px-1", className)}>
      {/* ── Filtro SVG (Definición Global Única por ID) ── */}
      <svg width="0" height="0" className="absolute pointer-events-none opacity-0">
        <defs>
          <filter id={`turbulent-displace-${id}`} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="8" result="noise1" seed="1" />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
              <animate attributeName="dy" values="100; 0" dur="8s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="8" result="noise2" seed="1" />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
              <animate attributeName="dy" values="0; -100" dur="8s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="8" result="noise1" seed="2" />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise3">
              <animate attributeName="dx" values="100; 0" dur="8s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="8" result="noise2" seed="2" />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise4">
              <animate attributeName="dx" values="0; -100" dur="8s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
            <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
            <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />

            <feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale="22" xChannelSelector="R" yChannelSelector="B" />
          </filter>
        </defs>
      </svg>

      <div className={cn("eb-card-container", className)}>
        <div className="eb-inner-container">
          <div className="eb-border-outer">
            <div className="eb-main-effect" style={{ filter: `url(#turbulent-displace-${id})` }} />
            <div className="eb-glow-1" />
            <div className="eb-glow-2" />
            <div className="eb-overlay-1" />
            <div className="eb-background-glow" />
            
            {/* ── Contenido ── */}
            <div className={cn("relative z-10 rounded-full px-4 py-1", innerClassName)}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
