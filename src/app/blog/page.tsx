"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const artigosBlog = [
  {
    titulo: "Como a Inteligência Artificial está Revolucionando a Educação",
    resumo: "Explorando as possibilidades transformadoras e os desafios éticos da IA no ambiente educacional moderno.",
    imagem: "/placeholder.svg?height=200&width=400",
    data: "2024-01-15",
    tempoLeitura: "8 min de leitura",
    categoria: "Tecnologia",
    slug: "ia-revolucionando-educacao",
  },
  {
    titulo: "Saúde Mental no Ambiente de Trabalho Tech: Um Guia Prático",
    resumo: "Estratégias comprovadas para manter o bem-estar mental e prevenir o burnout em carreiras de tecnologia.",
    imagem: "/placeholder.svg?height=200&width=400",
    data: "2024-01-10",
    tempoLeitura: "6 min de leitura",
    categoria: "Saúde Mental",
    slug: "saude-mental-tech",
  },
  {
    titulo: "Matemática e Programação: A Conexão Fundamental",
    resumo:
      "Como conceitos matemáticos fundamentam o desenvolvimento de software e por que isso importa para sua carreira.",
    imagem: "/placeholder.svg?height=200&width=400",
    data: "2024-01-05",
    tempoLeitura: "10 min de leitura",
    categoria: "Educação",
    slug: "matematica-programacao",
  },
  {
    titulo: "Tutorial: Criando Chatbots Educacionais com OpenAI",
    resumo: "Guia passo a passo para desenvolver assistentes virtuais inteligentes focados em educação.",
    imagem: "/placeholder.svg?height=200&width=400",
    data: "2023-12-28",
    tempoLeitura: "12 min de leitura",
    categoria: "Tutorial",
    slug: "chatbots-educacionais",
  },
  {
    titulo: "O Futuro da Educação Digital no Brasil",
    resumo: "Análise das tendências e inovações tecnológicas que estão moldando o futuro do ensino brasileiro.",
    imagem: "/placeholder.svg?height=200&width=400",
    data: "2023-12-20",
    tempoLeitura: "7 min de leitura",
    categoria: "Educação",
    slug: "futuro-educacao-digital",
  },
  {
    titulo: "Desenvolvendo Apps Mobile para Educação: Melhores Práticas",
    resumo: "Guia completo com as melhores práticas para criar aplicativos educacionais eficazes e engajantes.",
    imagem: "/placeholder.svg?height=200&width=400",
    data: "2023-12-15",
    tempoLeitura: "9 min de leitura",
    categoria: "Desenvolvimento",
    slug: "apps-mobile-educacao",
  },
]

export default function Blog() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog & Artigos</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Compartilhando conhecimentos e experiências sobre tecnologia, educação, inteligência artificial e
            desenvolvimento pessoal.
          </p>
        </motion.div>

        {/* Artigo em Destaque */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <Image
                  src={artigosBlog[0].imagem || "/placeholder.svg"}
                  alt={artigosBlog[0].titulo}
                  width={400}
                  height={300}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <Badge className="mb-4">{artigosBlog[0].categoria}</Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{artigosBlog[0].titulo}</h2>
                <p className="text-muted-foreground mb-6">{artigosBlog[0].resumo}</p>
                <div className="flex items-center text-sm text-muted-foreground mb-6">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="mr-4">{new Date(artigosBlog[0].data).toLocaleDateString("pt-BR")}</span>
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{artigosBlog[0].tempoLeitura}</span>
                </div>
                <Button asChild>
                  <Link href={`/blog/${artigosBlog[0].slug}`}>
                    Ler Artigo Completo <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Grade de Artigos */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-8">Publicações Recentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artigosBlog.slice(1).map((artigo, index) => (
              <motion.div
                key={artigo.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow group">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={artigo.imagem || "/placeholder.svg"}
                      alt={artigo.titulo}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4">{artigo.categoria}</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{artigo.titulo}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{artigo.resumo}</p>
                    <div className="flex items-center text-xs text-muted-foreground mb-4">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="mr-3">{new Date(artigo.data).toLocaleDateString("pt-BR")}</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{artigo.tempoLeitura}</span>
                    </div>
                    <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                      <Link href={`/blog/${artigo.slug}`}>
                        Continuar Lendo <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Newsletter */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Receba Novos Artigos por Email</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Inscreva-se na minha newsletter para receber os últimos artigos sobre tecnologia, educação e
                desenvolvimento pessoal diretamente no seu email.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Digite seu melhor email"
                  className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
                />
                <Button>Inscrever-se Gratuitamente</Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  )
}
