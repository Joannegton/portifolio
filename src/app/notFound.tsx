"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="text-9xl font-bold gradient-text mb-4">404</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Página Não Encontrada</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
            Ops! A página que você está procurando não existe ou foi movida para outro local.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Voltar ao Início
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Página Anterior
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
