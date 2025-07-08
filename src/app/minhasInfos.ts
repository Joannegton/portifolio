import { BookOpen, Brain, Code, Rocket, Sparkles, Users, Zap } from "lucide-react"

const links = {
  'linkedin': '',
  'fotoPerfil': 'https://media.licdn.com/dms/image/v2/D4D03AQHWU-e7R1aS2g/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1686340351520?e=1756944000&v=beta&t=dBnG8KEWUlKUD5sopGsRfy6tnvlOdxpsBjPZBBHUpZ4'
}

const habilidades = [
  "ReactJs",
  "NextJs",
  "NestJs",
  "TypeScript",
  "DDD",
  "TypeORM",
  "Kafka",
  "MongoDB",
  "PostgreSQL",
  "Firebase",
  "Flutter",
  "Kotlin",
  "Python",
  "N8n",
  "OpenAI",
  "Gemini",
  "Machine Learning",
  "Zoho",
  "GeoGebra",
]

export interface Destaques {
  icon: React.ComponentType<{ className?: string }>
  titulo: string
  descricao: string
  cor: string
}

const destaques = [
  {
    icon: Code,
    titulo: "Desenvolvedor Full Stack",
    descricao: "Criação de soluções completas com foco em web, mobile e IA.",
    cor: "from-purple-500 to-pink-500",
  },
  {
    icon: Users,
    titulo: "Professor & Multiplicador",
    descricao: "Formador de professores e mentor de alunos em tecnologia e matemática.",
    cor: "from-blue-500 to-cyan-500",
  },
  {
    icon: Brain,
    titulo: "Projetos com Saúde Mental",
    descricao: "Criador do Psy, terapeuta virtual com IA para suporte emocional e social.",
    cor: "from-green-500 to-emerald-500",
  },
  {
    icon: BookOpen,
    titulo: "Educação Inovadora",
    descricao: "Gamificação, plataformas educacionais e uso de IA na aprendizagem.",
    cor: "from-orange-500 to-red-500",
  },
]

export type Estatistica = {
  icone: React.ElementType
  numero: string
  rotulo: string
}
const estatisticas: Estatistica[] = [
  { numero: "40+", rotulo: "Projetos Desenvolvidos", icone: Rocket },
  { numero: "700+", rotulo: "Alunos Impactados", icone: Users },
  { numero: "5+", rotulo: "Anos de Experiência", icone: Zap },
  { numero: `${habilidades.length}+`, rotulo: "Tecnologias Dominadas", icone: Sparkles },
]

export { habilidades, destaques, estatisticas, links }