"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Github, Globe, Smartphone, Server, Brain, Layers } from "lucide-react"
import Image from "next/image"
import { Projeto, projetos } from "../minhasInfos"

const categorias = [
  { id: "todos", rotulo: "Todos os Projetos", icone: Layers },
  { id: "web", rotulo: "Desenvolvimento Web", icone: Globe },
  { id: "api", rotulo: "APIs e Backend", icone: Server },
  { id: "mobile", rotulo: "Aplicativos Mobile", icone: Smartphone },
  { id: "ai", rotulo: "Inteligência Artificial", icone: Brain },
]

export default function Projetos() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("todos")
  const [projetosPorCategoria, setProjetosPorCategoria] = useState<Projeto[]>([])

  useEffect(() => {
    obterProjetosPorCategoria("todos")
  }, []);
  
  const obterProjetosPorCategoria = (categoria: string) => {
    let projetosFiltrados;
    
    switch (categoria) {
      case "web":
        projetosFiltrados = projetos.filter((projeto) => projeto.categorias.includes("web"))
        break
      case "api":
        projetosFiltrados = projetos.filter((projeto) => projeto.categorias.includes("api"))
        break
      case "mobile":
        projetosFiltrados = projetos.filter((projeto) => projeto.categorias.includes("mobile"))
        break
      case "ai":
        projetosFiltrados = projetos.filter((projeto) => projeto.categorias.includes("ai"))
        break
      case "todos":
      default:
        projetosFiltrados = projetos
    }
    
    const parseData = (dataString: string) => {
      const [mes, ano] = dataString.split('/').map(Number)
      return new Date(ano, mes - 1)
    }
    
    const projetosOrdenados = projetosFiltrados.toSorted((a, b) => 
      parseData(b.data).getTime() - parseData(a.data).getTime()
    )
    
    setProjetosPorCategoria(projetosOrdenados)
  }

  const handleCategoriaChange = (value: string) => {
    setCategoriaAtiva(value)
    obterProjetosPorCategoria(value)
  }

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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Meus Projetos</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Uma seleção cuidadosa dos projetos que desenvolvi, organizados por categoria e tecnologia utilizada.
          </p>
        </motion.div>

        {/* Categorias */}
        <Tabs value={categoriaAtiva} onValueChange={handleCategoriaChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
            {categorias.map((categoria) => (
              <TabsTrigger key={categoria.id} value={categoria.id} className="flex items-center gap-2">
                <categoria.icone className="h-4 w-4" />
                <span className="hidden sm:inline">{categoria.rotulo}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categorias.map((categoria) => (
            <TabsContent key={categoria.id} value={categoria.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {projetosPorCategoria.map((projeto, index) => (
                  <motion.div
                    key={projeto.titulo}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
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
                            <Button size="sm" variant="secondary" asChild>
                              <a href={projeto.github} target="_blank" rel="noopener noreferrer">
                                <Github className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button size="sm" variant="secondary" asChild>
                              <a href={projeto.demo} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
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
                          {projeto.tecnologias.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" asChild className="flex-1 bg-transparent">
                            <a href={projeto.github} target="_blank" rel="noopener noreferrer">
                              <Github className="h-4 w-4 mr-2" />
                              Ver Código
                            </a>
                          </Button>
                          <Button size="sm" asChild className="flex-1">
                            <a href={projeto.demo} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Ver Demo
                            </a>
                          </Button>
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
