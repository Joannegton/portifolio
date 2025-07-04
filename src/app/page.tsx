"use client"

import { useScroll, useTransform, useInView } from "framer-motion"
import { useRef } from "react"
import { HeroSection } from "@/components/HeroSection"
import { EstatisticasSection } from "@/components/EstatisticasSection"
import { HabilidadesSection } from "@/components/HabilidadesSection"
import { DestaquesSection } from "@/components/DestaquesSection"
import { CtaSection } from "@/components/CtaSection"
import { destaques, estatisticas, habilidades } from "./minhasInfos"

export default function Inicio() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const heroRef = useRef(null)
  const habilidadesRef = useRef(null)
  const destaquesRef = useRef(null)
  const estatisticasRef = useRef(null)

  const heroEmView = useInView(heroRef, { once: true })
  const habilidadesEmView = useInView(habilidadesRef, { once: true, margin: "-100px" })
  const destaquesEmView = useInView(destaquesRef, { once: true, margin: "-100px" })
  const estatisticasEmView = useInView(estatisticasRef, { once: true, margin: "-100px" })

  return (
    <div className="min-h-screen relative overflow-hidden">
      <HeroSection 
        heroRef={heroRef} 
        heroEmView={heroEmView} 
        y={y} 
        opacity={opacity} 
      />
      <EstatisticasSection 
        estatisticas={estatisticas} 
        estatisticasRef={estatisticasRef} 
        estatisticasEmView={estatisticasEmView} 
      />
      <HabilidadesSection 
        habilidades={habilidades} 
        habilidadesRef={habilidadesRef} 
        habilidadesEmView={habilidadesEmView} 
      />
      <DestaquesSection 
        destaques={destaques} 
        destaquesRef={destaquesRef} 
        destaquesEmView={destaquesEmView} 
      />
      <CtaSection />
    </div>
  )
}
