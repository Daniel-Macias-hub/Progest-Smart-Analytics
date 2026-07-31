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
  const setClamped = (d: Date | undefined) => {
    if (!d) return onDateChange(undefined)
    onDateChange(clampDate(d, minDate, maxDate))
  }

  const formattedValue = date ? date.toISOString().split("T")[0] : ""

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={formattedValue}
          min={minDate ? minDate.toISOString().split("T")[0] : undefined}
          max={maxDate ? maxDate.toISOString().split("T")[0] : undefined}
          disabled={disabled}
          onChange={(e) => {
            if (e.target.value) {
              const [y, m, d] = e.target.value.split("-").map(Number)
              setClamped(new Date(y, m - 1, d))
            } else {
              setClamped(undefined)
            }
          }}
          className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="flex flex-wrap gap-1.5 pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs font-medium bg-background hover:bg-primary/10 hover:text-primary border-border"
          disabled={disabled}
          onClick={() => setClamped(addDays(new Date(), 1))}
        >
          Mañana
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs font-medium bg-background hover:bg-primary/10 hover:text-primary border-border"
          disabled={disabled}
          onClick={() => setClamped(addDays(new Date(), 3))}
        >
          +3 días
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs font-medium bg-background hover:bg-primary/10 hover:text-primary border-border"
          disabled={disabled}
          onClick={() => setClamped(addDays(new Date(), 7))}
        >
          +1 semana
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs font-medium bg-background hover:bg-primary/10 hover:text-primary border-border"
          disabled={disabled}
          onClick={() => setClamped(addDays(new Date(), 14))}
        >
          +2 semanas
        </Button>
      </div>
    </div>
  )
}
