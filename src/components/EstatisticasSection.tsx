import { Estatistica } from "@/app/minhasInfos"
import { motion } from "framer-motion"

export interface EstatisticasSectionProps {
  estatisticas: Estatistica[]
  estatisticasRef: React.RefObject<HTMLDivElement | null>
  estatisticasEmView: boolean
}

export function EstatisticasSection({ estatisticas, estatisticasRef, estatisticasEmView }: EstatisticasSectionProps) {
  return (
    <section ref={estatisticasRef} className="py-20 px-4 relative">
      <div className="container mx-auto">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={estatisticasEmView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {estatisticas.map((stat: Estatistica, index: number) => (
            <motion.div
              key={stat.rotulo}
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={estatisticasEmView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <div className="card-gradient rounded-2xl p-6 card-3d">
                <stat.icone className="h-8 w-8 mx-auto mb-4 text-primary" />
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.numero}</div>
                <div className="text-sm text-muted-foreground">{stat.rotulo}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
