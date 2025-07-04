import { motion, MotionValue } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap } from "lucide-react"
import Link from "next/link"
import { BolhasAnimadas } from "@/components/BolhasAnimada"
import { BotaoMagnetic } from "@/components/BotaoMagnetic"
import { links } from "@/app/minhasInfos"
import Image from "next/image"

interface HeroSectionProps {
    heroRef: React.RefObject<HTMLDivElement | null>;
    heroEmView: boolean;
    y: MotionValue<string>;
    opacity: MotionValue<number>;
}
export function HeroSection({ heroRef, heroEmView, y, opacity }: HeroSectionProps ) {
  return (
    <section ref={heroRef} className="hero-gradient min-h-screen flex items-center justify-center px-4 relative">
      <BolhasAnimadas />
      <motion.div className="container mx-auto text-center relative z-10" style={{ y, opacity }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={heroEmView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            className="mb-6"
            initial={{ scale: 0 }}
            animate={heroEmView ? { scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-1 glow-effect">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                <Image 
                  src={links.fotoPerfil} 
                  alt="Avatar" 
                  width={150}
                  height={150}
                  className="w-full h-full object-cover rounded-full" 
                />
              </div>
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={heroEmView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Olá, eu sou <span className="gradient-text neon-text block md:inline">Joannegton</span>
          </motion.h1>

          <motion.div
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={heroEmView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="whitespace-normal break-words">
              <span className="typing-animation">
                Desenvolvedor Full Stack, Professor, Palestrante e Criador de Projetos com Foco em Tecnologia e Matemática
              </span>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={heroEmView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <BotaoMagnetic>
              <Button
                asChild
                size="lg"
                className="ripple glow-effect bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-8 py-6 text-lg"
              >
                <Link href="/projetos">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Ver Projetos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </BotaoMagnetic>

            <BotaoMagnetic>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="glass border-white/20 hover:bg-white/10 px-8 py-6 text-lg bg-transparent"
              >
                <Link href="/contato">
                  <Zap className="mr-2 h-5 w-5" />
                  Entrar em Contato
                </Link>
              </Button>
            </BotaoMagnetic>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Indicador de Scroll */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </motion.div>
    </section>
  )
}
