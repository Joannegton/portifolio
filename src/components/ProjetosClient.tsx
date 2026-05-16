"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ExternalLink, Github, Globe, Smartphone, Server,
  Brain, Layers, ArrowUpDown, CalendarArrowDown, CalendarArrowUp, ArrowDownAZ,
} from "lucide-react"
import Image from "next/image"
import type { Project } from "@/entities/Project.entity"

type OrdemTipo = "recentes" | "antigos" | "az"

const opcoesOrdem: { id: OrdemTipo; rotulo: string; icone: React.ElementType }[] = [
  { id: "recentes", rotulo: "Mais recentes", icone: CalendarArrowDown },
  { id: "antigos", rotulo: "Mais antigos", icone: CalendarArrowUp },
  { id: "az", rotulo: "A–Z", icone: ArrowDownAZ },
]

const categorias = [
  { id: "todos", rotulo: "Todos os Projetos", icone: Layers },
  { id: "web", rotulo: "Desenvolvimento Web", icone: Globe },
  { id: "api", rotulo: "APIs e Backend", icone: Server },
  { id: "mobile", rotulo: "Aplicativos Mobile", icone: Smartphone },
  { id: "ai", rotulo: "Inteligência Artificial", icone: Brain },
]

const parseData = (dataString: string) => {
  const [mes, ano] = dataString.split("/").map(Number)
  return new Date(ano, mes - 1)
}

const ordenar = (lista: Project[], ordem: OrdemTipo): Project[] =>
  lista.toSorted((a, b) => {
    if (ordem === "recentes") return parseData(b.data).getTime() - parseData(a.data).getTime()
    if (ordem === "antigos") return parseData(a.data).getTime() - parseData(b.data).getTime()
    return a.titulo.localeCompare(b.titulo, "pt-BR")
  })

const filtrar = (lista: Project[], categoria: string): Project[] => {
  if (categoria === "todos") return lista
  return lista.filter((p) => {
    const cats = Array.isArray(p.categorias) ? p.categorias : (p.categorias as string).split(",")
    return cats.map((c) => c.trim()).includes(categoria)
  })
}

export function ProjetosClient({ projetos }: { projetos: Project[] }) {
  const [categoriaAtiva, setCategoriaAtiva] = useState("todos")
  const [ordem, setOrdem] = useState<OrdemTipo>("recentes")

  const projetosFiltrados = ordenar(filtrar(projetos, categoriaAtiva), ordem)

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Meus Projetos</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Uma seleção cuidadosa dos projetos que desenvolvi, organizados por categoria e tecnologia utilizada.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-end gap-2 mb-6"
        >
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground mr-1">Ordenar:</span>
          {opcoesOrdem.map((opcao) => {
            const Icone = opcao.icone
            const ativo = ordem === opcao.id
            return (
              <button
                key={opcao.id}
                onClick={() => setOrdem(opcao.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer
                  ${ativo
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                  }`}
              >
                <Icone className="h-3.5 w-3.5" />
                {opcao.rotulo}
              </button>
            )
          })}
        </motion.div>

        <Tabs value={categoriaAtiva} onValueChange={setCategoriaAtiva} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
            {categorias.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-2">
                <cat.icone className="h-4 w-4" />
                <span className="hidden sm:inline">{cat.rotulo}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categorias.map((cat) => (
            <TabsContent key={cat.id} value={cat.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {projetosFiltrados.map((projeto, index) => (
                  <motion.div
                    key={projeto.id ?? projeto.titulo}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow group">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <Image
                          src={projeto.imagem || "/placeholder.svg"}
                          alt={projeto.titulo}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="flex space-x-2">
                            {projeto.github && (
                              <Button size="sm" variant="secondary" asChild>
                                <a href={projeto.github} target="_blank" rel="noopener noreferrer">
                                  <Github className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            {projeto.demo && (
                              <Button size="sm" variant="secondary" asChild>
                                <a href={projeto.demo} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{projeto.titulo}</CardTitle>
                          <Badge variant="outline">{projeto.categoria}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm mb-4">{projeto.descricao}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(Array.isArray(projeto.tecnologias)
                            ? projeto.tecnologias
                            : (projeto.tecnologias as string).split(",")
                          ).map((tech) => (
                            <Badge key={tech.trim()} variant="secondary" className="text-xs">
                              {tech.trim()}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          {projeto.github && (
                            <Button size="sm" variant="outline" asChild className="flex-1 bg-transparent">
                              <a href={projeto.github} target="_blank" rel="noopener noreferrer">
                                <Github className="h-4 w-4 mr-2" />
                                Ver Código
                              </a>
                            </Button>
                          )}
                          {projeto.demo && (
                            <Button size="sm" asChild className="flex-1">
                              <a href={projeto.demo} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Ver Demo
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
