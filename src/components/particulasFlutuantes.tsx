"use client"

import { useEffect, useRef } from "react"

export function FloatingParticles() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const createParticle = () => {
      const particle = document.createElement("div")
      particle.className = "particle"

      const size = Math.random() * 4 + 2
      const x = Math.random() * window.innerWidth
      const duration = Math.random() * 3 + 4
      const delay = Math.random() * 2

      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${x}px`
      particle.style.top = `${window.innerHeight + 10}px`
      particle.style.animationDuration = `${duration}s`
      particle.style.animationDelay = `${delay}s`

      container.appendChild(particle)

      setTimeout(
        () => {
          if (container.contains(particle)) {
            container.removeChild(particle)
          }
        },
        (duration + delay) * 1000,
      )
    }

    const interval = setInterval(createParticle, 300)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return <div ref={containerRef} className="floating-particles" />
}
