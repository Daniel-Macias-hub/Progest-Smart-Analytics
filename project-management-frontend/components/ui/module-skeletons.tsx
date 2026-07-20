"use client"

import React from "react"
import { Loader2 } from "lucide-react"

interface ModuleSkeletonProps {
  message?: string
}

export function DashboardSkeleton({ message = "Cargando Dashboard..." }: ModuleSkeletonProps) {
  return (
    <div className="space-y-6 animate-pulse p-2">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted/60 rounded-md" />
          <div className="h-4 w-40 bg-muted/40 rounded-md" />
        </div>
        <div className="flex items-center gap-2 text-sm text-primary font-medium bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{message}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-28 bg-card/60 border border-border/40 rounded-xl p-4 space-y-3">
            <div className="h-4 w-20 bg-muted/60 rounded" />
            <div className="h-8 w-12 bg-muted/80 rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 h-72 bg-card/60 border border-border/40 rounded-xl p-6 space-y-4">
          <div className="h-5 w-48 bg-muted/60 rounded" />
          <div className="h-48 w-full bg-muted/30 rounded-lg" />
        </div>
        <div className="h-72 bg-card/60 border border-border/40 rounded-xl p-6 space-y-4">
          <div className="h-5 w-36 bg-muted/60 rounded" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-full bg-muted/30 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function TasksSkeleton({ message = "Obteniendo tareas..." }: ModuleSkeletonProps) {
  return (
    <div className="space-y-6 animate-pulse p-2">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted/60 rounded-md" />
          <div className="h-4 w-64 bg-muted/40 rounded-md" />
        </div>
        <div className="flex items-center gap-2 text-sm text-primary font-medium bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{message}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="h-10 flex-1 bg-card/60 border border-border/40 rounded-lg" />
        <div className="h-10 w-36 bg-card/60 border border-border/40 rounded-lg" />
        <div className="h-10 w-36 bg-card/60 border border-border/40 rounded-lg" />
      </div>

      <div className="bg-card/60 border border-border/40 rounded-xl p-4 space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-14 w-full bg-muted/30 rounded-lg flex items-center px-4 justify-between">
            <div className="h-4 w-1/3 bg-muted/60 rounded" />
            <div className="h-4 w-20 bg-muted/40 rounded" />
            <div className="h-4 w-24 bg-muted/50 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function BoardSkeleton({ message = "Sincronizando tablero..." }: ModuleSkeletonProps) {
  return (
    <div className="space-y-6 animate-pulse p-2">
      <div className="flex items-center justify-between">
        <div className="h-8 w-44 bg-muted/60 rounded-md" />
        <div className="flex items-center gap-2 text-sm text-primary font-medium bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{message}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((col) => (
          <div key={col} className="bg-card/40 border border-border/40 rounded-xl p-3 space-y-3 min-h-[400px]">
            <div className="h-6 w-28 bg-muted/60 rounded" />
            {[1, 2, 3].map((card) => (
              <div key={card} className="h-24 bg-card border border-border/30 rounded-lg p-3 space-y-2">
                <div className="h-4 w-3/4 bg-muted/60 rounded" />
                <div className="h-3 w-1/2 bg-muted/30 rounded" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ReportsSkeleton({ message = "Preparando reportes..." }: ModuleSkeletonProps) {
  return (
    <div className="space-y-6 animate-pulse p-2">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-muted/60 rounded-md" />
        <div className="flex items-center gap-2 text-sm text-primary font-medium bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{message}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-card/60 border border-border/40 rounded-xl p-6" />
        <div className="h-64 bg-card/60 border border-border/40 rounded-xl p-6" />
      </div>
    </div>
  )
}
