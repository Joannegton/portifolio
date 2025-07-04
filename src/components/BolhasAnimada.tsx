"use client"

import { motion } from "framer-motion"

export function BolhasAnimadas() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <motion.div
                className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20" 
                style={{
                    background: "linear-gradient(45deg, #8b5cf6, #06b6d4)"
                }}
                animate={{
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20"
                style={{
                    background: "linear-gradient(45deg, #10b981, #f59e0b)",
                }}
                animate={{
                    x: [0, -30, 0],
                    y: [0, 40, 0],
                    scale: [1, 0.9, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
            />
        </div>
    )
}