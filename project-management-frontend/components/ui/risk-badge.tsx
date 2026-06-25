"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import {
  RISK_LEVEL_LABELS,
  RISK_LEVEL_LABELS_SHORT,
  RISK_LEVEL_COLORS,
  RISK_LEVEL_COLORS_LIGHT,
  RISK_FACTOR_LABELS,
} from "@/lib/constants"
import { AlertTriangle, CheckCircle2, Circle, ShieldAlert } from "lucide-react"

// ── Types ────────────────────────────────────────────────────

export type RiskLevel = "no_risk" | "low" | "medium" | "high"
export type RiskBadgeVariant = "compact" | "normal" | "dashboard"

export interface RiskBadgeProps {
  /** Nivel de riesgo calculado por el Smart Risk Engine */
  riskStatus: RiskLevel
  /** Probabilidad de retraso (0.0 – 1.0) */
  delayProbability?: number
  /** Días de retraso estimados */
  predictedDelayDays?: number
  /** Factores de riesgo detectados */
  riskFactors?: Record<string, boolean>
  /** Variante visual */
  variant?: RiskBadgeVariant
  /** Si se provee, el badge es clickeable (preparado para panel/modal futuro) */
  onDetailClick?: () => void
  /** Usar paleta para fondos claros */
  lightBackground?: boolean
  /** Clases CSS adicionales */
  className?: string
}

// ── Icon Selector ────────────────────────────────────────────

function RiskIcon({ level, className }: { level: RiskLevel; className?: string }) {
  switch (level) {
    case "high":
      return <AlertTriangle className={cn("h-3.5 w-3.5", className)} />
    case "medium":
      return <ShieldAlert className={cn("h-3.5 w-3.5", className)} />
    case "low":
      return <Circle className={cn("h-3 w-3", className)} />
    case "no_risk":
    default:
      return <CheckCircle2 className={cn("h-3.5 w-3.5", className)} />
  }
}

// ── Tooltip Content ──────────────────────────────────────────

function RiskTooltipContent({
  riskStatus,
  delayProbability,
  predictedDelayDays,
  riskFactors,
}: Pick<RiskBadgeProps, "riskStatus" | "delayProbability" | "predictedDelayDays" | "riskFactors">) {
  const probabilityPct = Math.round((delayProbability ?? 0) * 100)
  const activeFactors = Object.entries(riskFactors ?? {}).filter(([, v]) => v)
  const colors = RISK_LEVEL_COLORS_LIGHT[riskStatus] ?? RISK_LEVEL_COLORS_LIGHT.no_risk

  return (
    <div className="flex flex-col gap-2 min-w-[200px] max-w-[260px] p-1">
      {/* Header */}
      <div className="flex items-center gap-2">
        <RiskIcon level={riskStatus} className={colors.text} />
        <span className={cn("text-xs font-bold uppercase tracking-wide", colors.text)}>
          {RISK_LEVEL_LABELS[riskStatus] ?? "Desconocido"}
        </span>
      </div>

      {/* Probability bar */}
      {riskStatus !== "no_risk" && (
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[10px]">
            <span className="text-muted-foreground">Probabilidad</span>
            <span className="font-semibold">{probabilityPct}%</span>
          </div>
          <Progress
            value={probabilityPct}
            className="h-1.5"
            indicatorClassName={cn(
              riskStatus === "high" && "bg-red-500",
              riskStatus === "medium" && "bg-amber-500",
              riskStatus === "low" && "bg-sky-500",
            )}
          />
        </div>
      )}

      {/* Risk factors */}
      {activeFactors.length > 0 && (
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-muted-foreground font-medium">Factores detectados:</span>
          <ul className="list-none p-0 m-0 space-y-0.5">
            {activeFactors.map(([key]) => (
              <li key={key} className="text-[10px] flex items-center gap-1.5">
                <span className={cn("h-1 w-1 rounded-full shrink-0", colors.dot)} />
                {RISK_FACTOR_LABELS[key] ?? key}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Predicted delay */}
      {riskStatus !== "no_risk" && (predictedDelayDays ?? 0) > 0 && (
        <div className="text-[10px] text-muted-foreground border-t pt-1.5">
          Retraso estimado: <span className="font-semibold text-foreground">~{predictedDelayDays} {predictedDelayDays === 1 ? "día" : "días"}</span>
        </div>
      )}

      {/* No risk message */}
      {riskStatus === "no_risk" && (
        <p className="text-[10px] text-muted-foreground">
          El Smart Risk Engine no detectó factores de riesgo en esta tarea.
        </p>
      )}
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────

export function RiskBadge({
  riskStatus,
  delayProbability = 0,
  predictedDelayDays = 0,
  riskFactors = {},
  variant = "compact",
  onDetailClick,
  lightBackground = false,
  className,
}: RiskBadgeProps) {
  const palette = lightBackground ? RISK_LEVEL_COLORS_LIGHT : RISK_LEVEL_COLORS
  const colors = palette[riskStatus] ?? palette.no_risk
  const isClickable = !!onDetailClick

  // ─── Compact variant (Kanban) ──────────────────────────────
  if (variant === "compact") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            onClick={isClickable ? onDetailClick : undefined}
            className={cn(
              "border-none gap-1 text-[10px] px-1.5 py-0.5 font-medium transition-colors",
              colors.bg,
              colors.text,
              riskStatus === "high" && "animate-pulse",
              isClickable && "cursor-pointer hover:opacity-80",
              className,
            )}
          >
            <RiskIcon level={riskStatus} className="h-3 w-3" />
            {RISK_LEVEL_LABELS_SHORT[riskStatus]}
          </Badge>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="bg-popover text-popover-foreground border shadow-lg rounded-lg p-2"
        >
          <RiskTooltipContent
            riskStatus={riskStatus}
            delayProbability={delayProbability}
            predictedDelayDays={predictedDelayDays}
            riskFactors={riskFactors}
          />
        </TooltipContent>
      </Tooltip>
    )
  }

  // ─── Normal variant (Task list) ────────────────────────────
  if (variant === "normal") {
    const probabilityPct = Math.round(delayProbability * 100)

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={isClickable ? onDetailClick : undefined}
            className={cn(
              "inline-flex flex-col gap-0.5 rounded-md border border-white/20 px-2 py-1 transition-colors",
              colors.bg,
              isClickable && "cursor-pointer hover:opacity-80",
              className,
            )}
          >
            <div className="flex items-center gap-1.5">
              <RiskIcon level={riskStatus} className={cn("h-3 w-3", colors.text)} />
              <span className={cn("text-[10px] font-semibold", colors.text)}>
                {RISK_LEVEL_LABELS[riskStatus]}
              </span>
            </div>
            {riskStatus !== "no_risk" && (
              <div className="w-full min-w-[60px]">
                <Progress
                  value={probabilityPct}
                  className="h-1"
                  indicatorClassName={cn(
                    riskStatus === "high" && "bg-red-400",
                    riskStatus === "medium" && "bg-amber-400",
                    riskStatus === "low" && "bg-sky-400",
                  )}
                />
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="bg-popover text-popover-foreground border shadow-lg rounded-lg p-2"
        >
          <RiskTooltipContent
            riskStatus={riskStatus}
            delayProbability={delayProbability}
            predictedDelayDays={predictedDelayDays}
            riskFactors={riskFactors}
          />
        </TooltipContent>
      </Tooltip>
    )
  }

  // ─── Dashboard variant (KPI panels / risk summary) ────────
  const probabilityPct = Math.round(delayProbability * 100)
  const lightColors = RISK_LEVEL_COLORS_LIGHT[riskStatus] ?? RISK_LEVEL_COLORS_LIGHT.no_risk

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          onClick={isClickable ? onDetailClick : undefined}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border px-3 py-2 transition-all",
            lightColors.bg,
            "border-transparent",
            riskStatus === "high" && "animate-pulse",
            isClickable && "cursor-pointer hover:shadow-md",
            className,
          )}
        >
          <RiskIcon level={riskStatus} className={cn("h-4 w-4 shrink-0", lightColors.text)} />
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className={cn("text-xs font-bold leading-none", lightColors.text)}>
              {RISK_LEVEL_LABELS[riskStatus]}
            </span>
            {riskStatus !== "no_risk" && (
              <div className="flex items-center gap-2">
                <Progress
                  value={probabilityPct}
                  className="h-1.5 w-16"
                  indicatorClassName={cn(
                    riskStatus === "high" && "bg-red-500",
                    riskStatus === "medium" && "bg-amber-500",
                    riskStatus === "low" && "bg-sky-500",
                  )}
                />
                <span className={cn("text-[10px] font-medium", lightColors.text)}>
                  {probabilityPct}%
                </span>
              </div>
            )}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="bg-popover text-popover-foreground border shadow-lg rounded-lg p-2"
      >
        <RiskTooltipContent
          riskStatus={riskStatus}
          delayProbability={delayProbability}
          predictedDelayDays={predictedDelayDays}
          riskFactors={riskFactors}
        />
      </TooltipContent>
    </Tooltip>
  )
}
