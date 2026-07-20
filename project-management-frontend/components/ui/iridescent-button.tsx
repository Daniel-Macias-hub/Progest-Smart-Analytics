"use client"

import { useRef, type MouseEvent, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import "./iridescent-button.css"

interface IridescentButtonProps {
  children: ReactNode
  className?: string
  variant?: "default" | "ghost"
  size?: "sm" | "md" | "lg"
  onClick?: () => void
  href?: string
  type?: "button" | "submit"
  disabled?: boolean
}

export function IridescentButton({
  children,
  className,
  variant = "default",
  size = "sm",
  onClick,
  type = "button",
  disabled,
}: IridescentButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null)

  function handlePointerMove(e: MouseEvent<HTMLButtonElement>) {
    const el = btnRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    el.style.setProperty("--coord-x", String(e.clientX - centerX))
    el.style.setProperty("--coord-y", String(centerY - e.clientY))
  }

  function handlePointerLeave() {
    const el = btnRef.current
    if (!el) return
    el.style.setProperty("--coord-x", "0")
    el.style.setProperty("--coord-y", "0")
  }

  return (
    <button
      ref={btnRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "irid-btn",
        `irid-btn-${size}`,
        `irid-btn-${variant}`,
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="irid-inner">{children}</div>
    </button>
  )
}

