"use client"

import { motion, AnimatePresence, Variants } from "framer-motion"
import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ElectricBorder } from "@/components/ui/electric-border"
import { MessageCircleQuestion, ChevronDown } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const faqs = [
  { q: "¿Qué es ProGest?",                          a: "ProGest es una plataforma SaaS de gestión de proyectos diseñada para equipos de cualquier industria. Permite organizar tareas, equipos, plazos y generar reportes de forma simple." },
  { q: "¿Es realmente gratuito?",                    a: "Sí, el plan MVP es completamente gratuito. Incluye 1 proyecto, hasta 10 miembros, tareas ilimitadas, board kanban, timeline, calendario y reportes básicos." },
  { q: "¿Qué roles existen?",                        a: "Hay tres roles: Owner (crea y administra el proyecto), Employee (miembro que trabaja en tareas asignadas) y SuperAdmin (administra toda la plataforma)." },
  { q: "¿Cuántos proyectos puedo crear?",            a: "En el plan gratuito (MVP), cada owner puede crear 1 proyecto con hasta 10 miembros. Los planes Pro y Enterprise permitirán proyectos múltiples." },
  { q: "¿Cómo invito miembros a mi equipo?",         a: "Desde la sección 'Equipo' puedes enviar invitaciones por email. El invitado recibe un enlace para crear su cuenta y unirse a tu proyecto." },
  { q: "¿Es seguro?",                                a: "Sí. ProGest implementa control de acceso por roles, autenticación con tokens, auditoría completa de acciones y aislamiento multitenant." },
  { q: "¿Puedo exportar mis datos?",                 a: "Sí, desde la sección de Reportes puedes exportar tus tareas y métricas en formato CSV." },
  { q: "¿Funciona en móvil?",                        a: "Sí, la interfaz es completamente responsive y funciona en cualquier dispositivo con navegador moderno." },
  { q: "¿Habrá integraciones con otras herramientas?", a: "En el plan Pro (próximamente) se incluirán integraciones con Slack, Google Calendar y más herramientas." },
  { q: "¿Cómo contacto a soporte?",                  a: "Puedes escribirnos desde la página de Contacto o enviar un email a soporte@progest.com." },
]

const containerVariants: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } },
}
const itemVariants: Variants = {
  hidden:  { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.38, ease: "easeOut" } },
}

export default function FAQPage() {
  return (
    <motion.div
      className="mx-auto max-w-3xl px-4 py-20 md:py-28"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >


      {/* Encabezado */}
      <div className="mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-4"
        >
          <ElectricBorder>
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <MessageCircleQuestion className="h-3.5 w-3.5" />
              {faqs.length} preguntas respondidas
            </span>
          </ElectricBorder>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mb-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl"
        >
          Preguntas Frecuentes
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-muted-foreground sm:text-lg"
        >
          Respuestas a las dudas más comunes sobre ProGest.
        </motion.p>
      </div>

      {/* Accordion Nativo Moderno con Stagger */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-4">
        {faqs.map((f, i) => (
          <motion.div key={i} variants={itemVariants}>
            <details 
              name="faq-progest"
              className="pg-faq-item dashed-border group rounded-xl border border-border/40 overflow-hidden" 
              style={{ "--dash-speed": "4s" } as any}
            >
              <summary className="pg-faq-summary px-6 py-5 text-left text-lg font-medium text-foreground/90 transition-all">
                {f.q}
              </summary>
              <div className="px-12 pb-6 text-base text-muted-foreground/90 leading-relaxed">
                <div className="pt-2 border-t border-border/20">
                  {f.a}
                </div>
              </div>
            </details>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA footer */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-14 text-center"
      >
        <p className="mb-4 text-sm text-muted-foreground">¿No encontraste tu respuesta?</p>
        <Link href="/contact">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Button variant="outline" className="rounded-xl px-8 h-11 border-primary/20 hover:border-primary/50 transition-colors">
              Escríbenos directamente
            </Button>
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  )
}
