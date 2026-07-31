"use client"

import * as React from "react"
import { addDays } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CalendarWithPresetsProps {
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
}

function normalizeDateOnly(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function clampDate(d: Date, minDate?: Date, maxDate?: Date) {
  const x = normalizeDateOnly(d).getTime()
  const min = minDate ? normalizeDateOnly(minDate).getTime() : null
  const max = maxDate ? normalizeDateOnly(maxDate).getTime() : null
  if (min !== null && x < min) return new Date(min)
  if (max !== null && x > max) return new Date(max)
  return d
}

export function CalendarWithPresets({ date, onDateChange, disabled, minDate, maxDate }: CalendarWithPresetsProps) {
  const isDateDisabled = (d: Date) => {
    if (disabled) return true
    const x = normalizeDateOnly(d).getTime()
    const min = minDate ? normalizeDateOnly(minDate).getTime() : null
    const max = maxDate ? normalizeDateOnly(maxDate).getTime() : null
    if (min !== null && x < min) return true
    if (max !== null && x > max) return true
    return false
  }

  const setClamped = (d: Date | undefined) => {
    if (!d) return onDateChange(undefined)
    onDateChange(clampDate(d, minDate, maxDate))
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal h-10 px-3 border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm",
              !date && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <span className="mr-2">📅</span>
            {date ? date.toLocaleDateString("es-ES", { 
              weekday: "short",
              day: "numeric", 
              month: "long", 
              year: "numeric" 
            }) : <span className="text-muted-foreground font-medium">Seleccionar fecha...</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          align="center"
          side="bottom"
          sideOffset={8}
          className="w-auto p-3 bg-popover border-border text-popover-foreground shadow-2xl rounded-xl z-[99999] max-w-[320px] flex flex-col gap-3"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fecha exacta:</span>
            <input
              type="date"
              value={date ? date.toISOString().split("T")[0] : ""}
              min={minDate ? minDate.toISOString().split("T")[0] : undefined}
              max={maxDate ? maxDate.toISOString().split("T")[0] : undefined}
              onChange={(e) => {
                if (e.target.value) {
                  const [y, m, d] = e.target.value.split("-").map(Number)
                  setClamped(new Date(y, m - 1, d))
                } else {
                  setClamped(undefined)
                }
              }}
              className="flex-1 h-8 rounded-md border border-input bg-background px-2 text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="rounded-md border border-border p-1 bg-background">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setClamped}
              disabled={isDateDisabled}
              className="p-1"
            />
          </div>

          <div className="flex flex-col gap-1.5 pt-1 border-t border-border">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Accesos rápidos:</span>
            <div className="grid grid-cols-2 gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs font-medium bg-background hover:bg-primary/10 hover:text-primary border-border"
                disabled={disabled}
                onClick={() => setClamped(new Date())}
              >
                Hoy
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs font-medium bg-background hover:bg-primary/10 hover:text-primary border-border"
                disabled={disabled}
                onClick={() => setClamped(addDays(new Date(), 1))}
              >
                Mañana
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs font-medium bg-background hover:bg-primary/10 hover:text-primary border-border"
                disabled={disabled}
                onClick={() => setClamped(addDays(new Date(), 3))}
              >
                En 3 días
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs font-medium bg-background hover:bg-primary/10 hover:text-primary border-border"
                disabled={disabled}
                onClick={() => setClamped(addDays(new Date(), 7))}
              >
                En 1 semana
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 w-full text-xs font-medium bg-background hover:bg-primary/10 hover:text-primary border-border mt-0.5"
              disabled={disabled}
              onClick={() => setClamped(addDays(new Date(), 14))}
            >
              En 2 semanas
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
