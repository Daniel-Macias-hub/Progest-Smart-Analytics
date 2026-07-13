"use client"

import React, { useRef, type MouseEvent, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface IridescentButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  className?: string
  variant?: "default" | "ghost"
  size?: "sm" | "md" | "lg"
}

export const IridescentButton = React.forwardRef<HTMLButtonElement, IridescentButtonProps>(({
  children,
  className,
  variant = "default",
  size = "sm",
  onClick,
  type = "button",
  disabled,
  ...props
}, ref) => {
  const btnRef = useRef<HTMLButtonElement | null>(null)

  const setRefs = (node: HTMLButtonElement | null) => {
    btnRef.current = node
    if (typeof ref === "function") {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }

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
      ref={setRefs}
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
      {...props}
    >
      <div className="irid-inner">{children}</div>
    </button>
  )
})
IridescentButton.displayName = "IridescentButton"

