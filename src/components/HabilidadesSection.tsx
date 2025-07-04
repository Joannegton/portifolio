import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export function HabilidadesSection({ habilidades, habilidadesRef, habilidadesEmView }: any) {
  return (
    <section ref={habilidadesRef} className="py-20 px-4 relative">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={habilidadesEmView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Tecnologias & Habilidades</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Experiência em diversas tecnologias para criar soluções completas e inovadoras
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={habilidadesEmView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {habilidades.map((habilidade: string, index: number) => (
            <motion.div
              key={habilidade}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={habilidadesEmView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.05,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge
                variant="secondary"
                className="text-sm py-3 px-6 card-gradient hover:glow-effect transition-all duration-300 cursor-pointer"
              >
                {habilidade}
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
