"use client"

import { motion } from "framer-motion";
import { ReactNode, useRef } from "react";

interface BotaoMagneticProps {
    children: ReactNode;
    className?: string;
}

export function BotaoMagnetic({ children, className }: BotaoMagneticProps) {
    const ref = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const { width, height, left, top } = ref.current!.getBoundingClientRect()
    const x = clientX - (left + width / 2)
    const y = clientY - (top + height / 2)

    ref.current!.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`
  }

  const handleMouseLeave = () => {
    ref.current!.style.transform = "translate(0px, 0px)"
  }

  return (
    <motion.div
        ref={ref}
        className={`magnetic ${className}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.div>
  )
} 