import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Destaques } from "@/app/minhasInfos";

interface DestaquesSectionProps {
    destaques: Destaques[];
    destaquesRef: React.RefObject<HTMLDivElement | null>;
    destaquesEmView: boolean;
}

export function DestaquesSection({ destaques, destaquesRef, destaquesEmView }: DestaquesSectionProps) {
  return (
    <section ref={destaquesRef} className="py-20 px-4 relative">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={destaquesEmView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">O que eu faço</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Combinando tecnologia, educação e impacto social para criar soluções significativas
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {destaques.map((destaque: Destaques, index: number) => (
            <motion.div
              key={destaque.titulo}
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              animate={destaquesEmView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -10, rotateX: 5 }}
              className="group"
            >
              <Card className="h-full card-gradient border-0 card-3d overflow-hidden relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${destaque.cor} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
                <CardContent className="p-8 text-center relative z-10">
                  <motion.div
                    className="mb-6"
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <destaque.icon className="h-16 w-16 mx-auto text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-4 group-hover:gradient-text transition-all duration-300">
                    {destaque.titulo}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{destaque.descricao}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
