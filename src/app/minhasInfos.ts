import { BookOpen, Brain, Code, Rocket, Sparkles, Users, Zap, GraduationCap, Heart, Target } from "lucide-react"

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

const formacaoAcademica = [
  {
    titulo: "Tecnólogo em Análise e Desenvolvimento de Sistemas",
    instituicao: "Centro Universitário Eniac",
    ano: "2023-2025",
    descricao: "Desenvolvimento de software.",
  },
  {
    titulo: "Pós graduação em Matemática Financeira e Estatística",
    instituicao: "Universidade Educamais",
    ano: "2020-2022",
    descricao: "Especialização em matemática aplicada à educação e finanças",
  },
  {
    titulo: "Licenciatura em Matemática",
    instituicao: "Universidade Nove de Julho",
    ano: "2018-2020",
    descricao: "Formação pedagógica com ênfase em tecnologias educacionais e metodologias ativas",
  }
]

const experienciaProfissional = [
  {
    cargo: "Desenvolvedor Full Stack",
    empresa: "VerdeCard Instituição de Pagamento S.A.",
    periodo: "2024 - Presente",
    descricao: "Desenvolvimento de aplicações web e mobile, APIs RESTful e soluções em nuvem",
  },
  {
    cargo: "Professor de Matemática e Programação",
    empresa: "Secretaria de Educação de São Paulo",
    periodo: "2020 - Presente",
    descricao: "Ensino de matemática e programação para ensino médio, desenvolvimento de projetos interdisciplinares e lógica de programação",
  },
  {
    cargo: "Desenvolvedor Freelancer",
    empresa: "Projetos Independentes",
    periodo: "2021 - Presente",
    descricao: "Desenvolvimento de soluções personalizadas para educação, saúde mental entre outros setores, com foco em acessibilidade e inclusão digital",
  },
]

const valores = [
  {
    icone: Heart,
    titulo: "Impacto Social Positivo",
    descricao:
      "Acredito que a tecnologia deve servir para melhorar a vida das pessoas e criar um mundo mais justo e inclusivo.",
  },
  {
    icone: GraduationCap,
    titulo: "Educação Transformadora",
    descricao:
      "A educação é a ferramenta mais poderosa para transformar vidas e sociedades. Busco sempre inovar no ensino.",
  },
  {
    icone: Target,
    titulo: "Excelência e Qualidade",
    descricao: "Comprometo-me com a qualidade técnica e a melhoria contínua em todos os projetos que desenvolvo.",
  },
]

export { habilidades, destaques, estatisticas, links, formacaoAcademica, experienciaProfissional, valores }