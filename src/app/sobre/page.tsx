"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { experienciaProfissional, formacaoAcademica, valores } from "../minhasInfos"

export default function Sobre() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Sobre Mim</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Sou um profissional apaixonado por matemática, tecnologia e educação, dedicado a criar soluções que fazem a
            diferença na vida das pessoas.
          </p>
        </motion.div>

        {/* História */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Minha Trajetória</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Minha jornada começou com uma paixão pela matemática e pela resolução de problemas complexos. Durante a
                graduação em Matemática, descobri o poder transformador da tecnologia como ferramenta educacional e
                decidi me especializar em desenvolvimento de software.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Ao longo dos anos, desenvolvi expertise em diversas tecnologias, sempre com foco em criar soluções que
                tenham impacto positivo na educação e na saúde mental. Acredito que a combinação entre conhecimento
                técnico sólido e sensibilidade social é fundamental para criar tecnologias verdadeiramente
                transformadoras.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Hoje, atuo como professor, desenvolvedor e palestrante, sempre buscando maneiras inovadoras de usar a
                tecnologia para democratizar o acesso ao conhecimento e promover o bem-estar das pessoas.
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Valores */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Meus Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {valores.map((valor, index) => (
              <motion.div
                key={valor.titulo}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center">
                  <CardContent className="p-6">
                    <valor.icone className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">{valor.titulo}</h3>
                    <p className="text-muted-foreground text-sm">{valor.descricao}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Formação */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Formação Acadêmica</h2>
          <div className="space-y-6">
            {formacaoAcademica.map((formacao, index) => (
              <motion.div
                key={formacao.titulo}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h3 className="text-lg font-semibold">{formacao.titulo}</h3>
                      <Badge variant="secondary">{formacao.ano}</Badge>
                    </div>
                    <p className="text-primary font-medium mb-2">{formacao.instituicao}</p>
                    <p className="text-muted-foreground text-sm">{formacao.descricao}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Experiência */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-8">Experiência Profissional</h2>
          <div className="space-y-6">
            {experienciaProfissional.map((exp, index) => (
              <motion.div
                key={exp.cargo}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h3 className="text-lg font-semibold">{exp.cargo}</h3>
                      <Badge variant="outline">{exp.periodo}</Badge>
                    </div>
                    <p className="text-primary font-medium mb-2">{exp.empresa}</p>
                    <p className="text-muted-foreground text-sm">{exp.descricao}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
