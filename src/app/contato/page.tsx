"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Mail, Phone, MapPin, Download, Github, Linkedin, FileText } from "lucide-react"

const informacoesContato = [
  {
    icone: Mail,
    titulo: "Email Profissional",
    valor: "joao.silva@email.com",
    href: "mailto:joao.silva@email.com",
  },
  {
    icone: Phone,
    titulo: "Telefone/WhatsApp",
    valor: "+55 (11) 99999-9999",
    href: "tel:+5511999999999",
  },
  {
    icone: MapPin,
    titulo: "Localização",
    valor: "São Paulo, SP - Brasil",
    href: "#",
  },
]

const linksSociais = [
  {
    icone: Github,
    titulo: "GitHub",
    href: "https://github.com",
    usuario: "@joaosilva-dev",
  },
  {
    icone: Linkedin,
    titulo: "LinkedIn",
    href: "https://linkedin.com",
    usuario: "/in/joaosilva-dev",
  },
  {
    icone: FileText,
    titulo: "Currículo Lattes",
    href: "http://lattes.cnpq.br",
    usuario: "Ver Currículo Completo",
  },
]

export default function Contato() {
  const [dadosFormulario, setDadosFormulario] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  })
  const [enviando, setEnviando] = useState(false)

  const handleMudancaInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDadosFormulario((prev) => ({ ...prev, [name]: value }))
  }

  const handleEnvio = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)

    // TODO simular envio do formulário
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast.success("Mensagem enviada com sucesso! ✅", {
        description: "Obrigado pelo contato! Responderei em breve.",
      })

      setDadosFormulario({ nome: "", email: "", assunto: "", mensagem: "" })
    } catch {
      toast.error("Erro ao enviar mensagem ❌", {
        description: "Tente novamente ou entre em contato diretamente por email.",
      })
    } finally {
      setEnviando(false)
    }
  }

  const baixarCV = () => {
    // Simular download do CV
    toast.info("Download iniciado 📄", {
      description: "O currículo será baixado em instantes.",
    })
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Vamos Conversar?</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Estou sempre aberto a novas oportunidades, colaborações e projetos desafiadores. Vamos conversar sobre como
            posso ajudar você!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário de Contato */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Envie uma Mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEnvio} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome Completo *</Label>
                      <Input
                        id="nome"
                        name="nome"
                        value={dadosFormulario.nome}
                        onChange={handleMudancaInput}
                        required
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={dadosFormulario.email}
                        onChange={handleMudancaInput}
                        required
                        placeholder="seu.email@exemplo.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="assunto">Assunto *</Label>
                    <Input
                      id="assunto"
                      name="assunto"
                      value={dadosFormulario.assunto}
                      onChange={handleMudancaInput}
                      required
                      placeholder="Sobre o que você gostaria de conversar?"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mensagem">Mensagem *</Label>
                    <Textarea
                      id="mensagem"
                      name="mensagem"
                      value={dadosFormulario.mensagem}
                      onChange={handleMudancaInput}
                      required
                      placeholder="Conte-me mais sobre seu projeto ou dúvida..."
                      rows={6}
                    />
                  </div>
                  <Button type="submit" disabled={enviando} className="w-full">
                    {enviando ? "Enviando Mensagem..." : "Enviar Mensagem"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Informações de Contato */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Detalhes de Contato */}
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {informacoesContato.map((info) => (
                  <div key={info.titulo} className="flex items-center space-x-3">
                    <info.icone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{info.titulo}</p>
                      <a
                        href={info.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {info.valor}
                      </a>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Download CV */}
            <Card>
              <CardHeader>
                <CardTitle>Baixar Currículo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Baixe meu currículo completo em PDF para conhecer mais detalhes sobre minha experiência e formação.
                </p>
                <Button onClick={baixarCV} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Currículo em PDF
                </Button>
              </CardContent>
            </Card>

            {/* Links Sociais */}
            <Card>
              <CardHeader>
                <CardTitle>Redes Sociais e Perfis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {linksSociais.map((social) => (
                  <a
                    key={social.titulo}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <social.icone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{social.titulo}</p>
                      <p className="text-sm text-muted-foreground">{social.usuario}</p>
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Seção FAQ */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Perguntas Frequentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Qual é o tempo de resposta?</h3>
                  <p className="text-sm text-muted-foreground">
                    Normalmente respondo em até 24 horas durante dias úteis.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Você trabalha com projetos remotos?</h3>
                  <p className="text-sm text-muted-foreground">
                    Sim! Trabalho com clientes de todo o Brasil e exterior de forma 100% remota.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Quais tipos de projeto você desenvolve?</h3>
                  <p className="text-sm text-muted-foreground">
                    Desenvolvimento web, mobile, APIs, projetos educacionais, consultoria em IA e automações.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Você oferece suporte pós-projeto?</h3>
                  <p className="text-sm text-muted-foreground">
                    Sim, ofereço suporte técnico e manutenção para todos os projetos desenvolvidos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  )
}
