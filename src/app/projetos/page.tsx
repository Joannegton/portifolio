"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Github, Globe, Smartphone, Server, Brain, BookOpen } from "lucide-react"
import Image from "next/image"

const projetos = {
  web: [
    {
      titulo: "Plataforma EduTech - Sistema de Ensino Online",
      descricao:
        "Sistema completo de gestão educacional com videoaulas interativas, exercícios gamificados e acompanhamento de progresso em tempo real.",
      imagem: "/placeholder.svg?height=200&width=300",
      tecnologias: ["React", "Next.js", "Node.js", "PostgreSQL", "Stripe", "WebRTC"],
      github: "https://github.com",
      demo: "https://demo.com",
      categoria: "Full Stack",
    },
    {
      titulo: "Dashboard de Analytics Educacionais",
      descricao:
        "Painel administrativo avançado para análise de dados educacionais com gráficos interativos e relatórios personalizados.",
      imagem: "/placeholder.svg?height=200&width=300",
      tecnologias: ["Vue.js", "D3.js", "Express", "MongoDB", "Chart.js"],
      github: "https://github.com",
      demo: "https://demo.com",
      categoria: "Frontend",
    },
    {
      titulo: "E-commerce de Materiais Educacionais",
      descricao: "Loja virtual especializada em materiais educacionais digitais com sistema de pagamento integrado.",
      imagem: "/placeholder.svg?height=200&width=300",
      tecnologias: ["React", "TypeScript", "Tailwind CSS", "Supabase", "Stripe"],
      github: "https://github.com",
      demo: "https://demo.com",
      categoria: "Full Stack",
    },
  ],
  api: [
    {
      titulo: "API de Gestão Escolar Completa",
      descricao:
        "API RESTful robusta para gerenciamento completo de instituições de ensino: alunos, professores, notas e frequência.",
      imagem: "/placeholder.svg?height=200&width=300",
      tecnologias: ["Node.js", "Express", "MongoDB", "JWT", "Swagger", "Redis"],
      github: "https://github.com",
      demo: "https://api-docs.com",
      categoria: "Backend",
    },
    {
      titulo: "API de Análise de Sentimentos Educacionais",
      descricao:
        "Serviço inteligente para análise de sentimentos em textos educacionais usando processamento de linguagem natural.",
      imagem: "/placeholder.svg?height=200&width=300",
      tecnologias: ["Python", "FastAPI", "NLTK", "PostgreSQL", "Docker"],
      github: "https://github.com",
      demo: "https://api-docs.com",
      categoria: "IA/ML",
    },
    {
      titulo: "API de Gamificação Educacional",
      descricao:
        "Sistema completo de pontuação, conquistas e rankings para plataformas educacionais com mecânicas de jogos.",
      imagem: "/placeholder.svg?height=200&width=300",
      tecnologias: ["PHP", "Laravel", "MySQL", "Redis", "WebSockets"],
      github: "https://github.com",
      demo: "https://api-docs.com",
      categoria: "Backend",
    },
  ],
  mobile: [
    {
      titulo: "MathAR - Matemática com Realidade Aumentada",
      descricao:
        "Aplicativo revolucionário para aprendizado de matemática com exercícios gamificados e realidade aumentada.",
      imagem: "/placeholder.svg?height=200&width=300",
      tecnologias: ["Flutter", "Dart", "Firebase", "ARCore", "TensorFlow Lite"],
      github: "https://github.com",
      demo: "https://play.google.com",
      categoria: "Mobile",
    },
    {
      titulo: "MindCare - Cuidados com a Saúde Mental",
      descricao:
        "App completo para monitoramento de saúde mental com diário emocional, meditações guiadas e chat com especialistas.",
      imagem: "/placeholder.svg?height=200&width=300",
      tecnologias: ["Kotlin", "Android", "Room", "Retrofit", "ML Kit"],
      github: "https://github.com",
      demo: "https://play.google.com",
      categoria: "Mobile",
    },
  ],
  ai: [
    {
      titulo: "EduBot - Assistente Virtual Educacional",
      descricao:
        "Chatbot inteligente para dúvidas acadêmicas usando GPT-4, base de conhecimento personalizada e integração com plataformas de ensino.",
      imagem: "/placeholder.svg?height=200&width=300",
      tecnologias: ["Python", "OpenAI API", "LangChain", "Streamlit", "Pinecone"],
      github: "https://github.com",
      demo: "https://chatbot-demo.com",
      categoria: "IA/ML",
    },
    {
      titulo: "Sistema de Recomendação Inteligente",
      descricao:
        "IA avançada para recomendação personalizada de conteúdos educacionais baseada no perfil e histórico do aluno.",
      imagem: "/placeholder.svg?height=200&width=300",
      tecnologias: ["Python", "TensorFlow", "Pandas", "Scikit-learn", "Apache Spark"],
      github: "https://github.com",
      demo: "https://demo.com",
      categoria: "IA/ML",
    },
  ],
  educacional: [
    {
      titulo: "Simulador Interativo de Funções Matemáticas",
      descricao:
        "Ferramenta educacional avançada em GeoGebra para visualização dinâmica de funções matemáticas complexas.",
      imagem: "/placeholder.svg?height=200&width=300",
      tecnologias: ["GeoGebra", "JavaScript", "HTML5", "CSS3", "WebGL"],
      github: "https://github.com",
      demo: "https://geogebra.org",
      categoria: "Educacional",
    },
    {
      titulo: "Curso Completo de Programação para Iniciantes",
      descricao: "Material didático abrangente para ensino de programação com exercícios práticos e projetos reais.",
      imagem: "/placeholder.svg?height=200&width=300",
      tecnologias: ["Markdown", "Jupyter", "Python", "Git", "GitHub Pages"],
      github: "https://github.com",
      demo: "https://curso-demo.com",
      categoria: "Educacional",
    },
  ],
}

const categorias = [
  { id: "web", rotulo: "Desenvolvimento Web", icone: Globe },
  { id: "api", rotulo: "APIs e Backend", icone: Server },
  { id: "mobile", rotulo: "Aplicativos Mobile", icone: Smartphone },
  { id: "ai", rotulo: "Inteligência Artificial", icone: Brain },
  { id: "educacional", rotulo: "Projetos Educacionais", icone: BookOpen },
]

export default function Projetos() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("web")

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
        <Tabs value={categoriaAtiva} onValueChange={setCategoriaAtiva} className="w-full">
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
                {projetos[categoria.id as keyof typeof projetos]?.map((projeto, index) => (
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
