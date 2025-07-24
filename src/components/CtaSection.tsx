import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BotaoMagnetic } from "@/components/BotaoMagnetic"
import { ArrowRight, Rocket } from "lucide-react"
import Link from "next/link"

export function ContatoSection() {
  return (
    <section className="py-20 px-4 relative">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="card-gradient rounded-3xl p-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Vamos trabalhar juntos?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
              Estou sempre aberto a novos projetos e oportunidades de colaboração. Entre em contato para conversarmos!
            </p>
            <BotaoMagnetic>
              <Button
                asChild
                size="lg"
                className="ripple glow-effect bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-8 py-6 text-lg"
              >
                <Link href="/contato">
                  <Rocket className="mr-2 h-5 w-5" />
                  Entrar em Contato
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </BotaoMagnetic>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
