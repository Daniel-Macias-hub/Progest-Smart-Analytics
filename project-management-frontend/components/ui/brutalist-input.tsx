"use client"

import React from "react"
import { UseFormRegisterReturn } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Loader2, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BrutalistInputProps {
  label: string
  id: string
  type?: string
  placeholder?: string
  register: UseFormRegisterReturn
  error?: string
  isValid?: boolean
  isLoading?: boolean
  className?: string
  showPasswordToggle?: boolean
  onTogglePassword?: () => void
  isPasswordVisible?: boolean
}

/**
 * BrutalistInput - Un componente de entrada con estética "Brutalist Modern".
 * Bordes negros audaces, sombras desplazadas y animaciones elásticas.
 */
export function BrutalistInput({
  label,
  id,
  type = "text",
  placeholder,
  register,
  error,
  isValid = false,
  isLoading = false,
  className,
  showPasswordToggle,
  onTogglePassword,
  isPasswordVisible,
}: BrutalistInputProps) {
  return (
    <div className={cn("relative w-full group py-4", className)}>


      <div className="brutalist-group relative">
        {/* Sombra/Fondo Negro */}
        <div className="absolute inset-0 bg-foreground rounded-none translate-y-0 translate-x-0" />

        {/* Contenedor Principal */}
        <div className="brutalist-container relative bg-card border-[3.5px] border-foreground overflow-hidden flex items-stretch">
          <div className="flex-1 flex flex-col pt-6 pb-2 px-5 min-h-[4.5rem]">
            {/* Label flotante o estática */}
            <label
              htmlFor={id}
              className={cn(
                "absolute left-5 font-black uppercase text-[10px] tracking-widest transition-all duration-300",
                "top-2 opacity-100 translate-y-0",
                !placeholder && "group-focus-within:opacity-100 group-focus-within:translate-y-0 opacity-0 translate-y-2"
              )}
            >
              {label}
            </label>

            <input
              id={id}
              type={showPasswordToggle ? (isPasswordVisible ? "text" : "password") : type}
              placeholder={placeholder}
              className={cn(
                "w-full bg-transparent border-none outline-none focus:ring-0 p-0 text-lg font-bold placeholder:text-foreground/30 placeholder:uppercase",
                isValid && "pr-12"
              )}
              {...register}
            />
          </div>

          {/* Icon Container (Sólo si es válido o si tiene toggle de password) */}
          <AnimatePresence>
            {(isValid || showPasswordToggle) && (
              <motion.div
                initial={{ x: 60 }}
                animate={{ x: 0 }}
                exit={{ x: 60 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={cn(
                  "flex items-center justify-center aspect-square h-full border-l-[3.5px] border-foreground",
                  isValid ? "bg-emerald-400" : "bg-primary"
                )}
              >
                {showPasswordToggle ? (
                  <button
                    type="button"
                    onClick={onTogglePassword}
                    className="p-3 text-white hover:scale-110 transition-transform active:scale-95"
                  >
                    {isPasswordVisible ? (
                      <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                         {/* El icono del ojo se maneja en el padre, pero aquí ponemos la base */}
                         {isPasswordVisible ? "Ocultar" : "Ver"}
                      </motion.div>
                    ) : "Ver"}
                  </button>
                ) : (
                  isValid && <Check className="text-foreground w-6 h-6 stroke-[3px]" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-black uppercase text-destructive mt-1 ml-1 tracking-tighter"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
