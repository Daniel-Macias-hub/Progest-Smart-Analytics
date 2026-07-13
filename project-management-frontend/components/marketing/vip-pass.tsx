"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"


/**
 * VipPass Component
 * 
 * Un componente que renderiza una tarjeta VIP con un efecto de patrón Moiré trippy.
 * Basado en la implementación de Less Rain GmbH.
 */
export function VipPass() {
  return (
    <div className="relative group w-full max-w-lg hidden lg:flex items-center justify-center p-8">


      <div className="vip-scene">
        <motion.div
          className="vip-card-container"
          initial={{ opacity: 0, x: -100, rotateY: -45 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 1.2, ease: "circOut" }}
        >
          <div className="card-layer-inner moire-effect">
            <div className="moire-pattern"></div>
            <div className="moire-pattern moving-p"></div>
            <div className="moire-pattern moving-extra-p"></div>
          </div>
          <div className="card-layer-inner flickering-lights-layer"></div>
          <div className="card-layer-inner text-content-layer">
            <div className="vip-title-text">Pro Gest</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
