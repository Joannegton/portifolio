import { BookOpen, Brain, Code, Rocket, Sparkles, Users, Zap, GraduationCap, Heart, Target, Linkedin, Mail, Phone, MapPin, Github } from "lucide-react"

const links = {
  'linkedin': 'https://linkedin.com/in/wellington-tavares-galbarini-21b915a9',
  'fotoPerfil': 'https://media.licdn.com/dms/image/v2/D4D03AQHWU-e7R1aS2g/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1686340351520?e=1756944000&v=beta&t=dBnG8KEWUlKUD5sopGsRfy6tnvlOdxpsBjPZBBHUpZ4'
}

const linksSociais = [
  {
    icone: Github,
    titulo: "GitHub",
    href: "https://github.com/joannegton",
    usuario: "@joannegton",
  },
  {
    icone: Linkedin,
    titulo: "LinkedIn",
    href: "https://linkedin.com/in/wellington-tavares-galbarini-21b915a9",
    usuario: "/in/wellington-tavares-galbarini-21b915a9",
  }
]

const informacoesContato = [
  {
    icone: Mail,
    titulo: "Email Profissional",
    valor: "joannegton@gmail.com",
    href: "mailto:joannegton@gmail.com",
  },
  {
    icone: Phone,
    titulo: "Telefone/WhatsApp",
    valor: "+55 (11) 97017-9936",
    href: "tel:+5511970179936",
  },
  {
    icone: MapPin,
    titulo: "Localização",
    valor: "São Paulo, SP - Brasil",
    href: "#",
  },
]

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

export interface Projeto {
  titulo: string
  descricao: string
  imagem: string
  tecnologias: string[]
  github?: string
  demo?: string
  categoria: string
  categorias: string[]
  data: string // Formato "MM/AAAA"
}
const projetos: Projeto[] = [
    {
      titulo: "Maleficis Tattoo",
      descricao:
        "Meu primeiro projeto da faculdade, foi inspirado nos trabalhos da minha esposa, que é tatuadora. O site foi desenvolvido com HTML, Css, JavaScript e Java Jsp, e tem como objetivo apresentar o portfólio dela.",
      imagem: "/assets/maleficis_tattoo.png",
      tecnologias: ["HTML", "CSS", "JavaScript", "Java Jsp"],
      github: "https://github.com/Joannegton/Maleficis_tattoo",
      demo: "https://joannegton.github.io/Maleficis_tattoo/",
      categoria: "Full Stack",
      categorias: ["web", "api"],
      data: "12/2023",
    },
    {
      titulo: "Sistema de avaliação de creditos",
      descricao:
        "Api para avaliação de crédito, desenvolvida com Java Spring Boot. A api é capaz de avaliar o crédito de um cliente, também listar os clientes com crédito aprovado. Projeto de base para aprendizado de Spring Boot.",
      imagem: "/assets/api.jpg",
      tecnologias: ["Java", "Spring Boot", "CleanCode", "Arquitetura Hexagonal"],
      github: "https://github.com/Joannegton/api_springboot",
      demo: "https://github.com/Joannegton/api_springboot",
      categoria: "Backend",
      categorias: ["api"],
      data: "12/2023",
    },
    {
      titulo: "Dashboard Nextjs",
      descricao: "Painel administrativo para visualização de dados com gráficos interativos e sistema de autenticação.",
      imagem: "/assets/api.jpg",
      tecnologias: ["NextJs", "TypeScript", "Tailwind CSS", "PostgreSQL"],
      github: "https://github.com/Joannegton/dashboard-nextjs/tree/main",
      demo: "https://dashboard-nextjs-eight-pink.vercel.app/",
      categoria: "Full Stack",
      categorias: ["web"],
      data: "05/2024",
    },
    {
      titulo: "Psy - Terapeuta Virtual",
      descricao: "Aplicativo de apoio emocional com IA empática, capaz de conversar com o usuário, sugerir profissionais e promover o autocuidado.",
      imagem: "/assets/psy.png", 
      tecnologias: ["Flutter", "Firebase", "OpenAI/Gemini API", "Node.js", "Firestore"],
      github: "https://github.com/Joannegton/psy_terapeuta_virtual/tree/gemini-api", //arrumar no github para a main(desatualizada)
      demo: "https://drive.google.com/drive/folders/1TIPXgQI4f-3QaV8vPWJKFaBxDNTY-Nfo?usp=sharing",
      categoria: "Mobile App",
      categorias: ["mobile", "ai"],
      data: "07/2025",
    },
    {
      titulo: "Need Drone Front",
      descricao:
        "Interface web para unir pessoas que necessitam de drones para alguma coisa e pessoas que oferecem serviços com drones.",
      imagem: "/assets/needDrone.jpg",
      tecnologias: ["ReactJs", "TypeScript", "CSS", "Motion"],
      github: "https://github.com/Joannegton/needDrone_front",
      demo: "https://need-drone-front.vercel.app/",
      categoria: "Frontend",
      categorias: ["api", "web"],
      data: "03/2024",
    },
    {
      titulo: "Need Drone API",
      descricao:
        "Api para integrar a interface web com o backend, unindo pessoas que necessitam de drones para alguma coisa e pessoas que oferecem serviços com drones.",
      imagem: "/assets/needDrone.jpg",
      tecnologias: ["JavaScript", "Node.js", "Express", "MongoDB", "JWT"],
      github: "https://github.com/Joannegton/needDrone_back",
      demo: "https://github.com/Joannegton/needDrone_back",
      categoria: "Backend",
      categorias: ["api", "web"],
      data: "03/2024",
    },
    {
      titulo: "Need Drone APP",
      descricao:
        "App ganhador do melhor projeto do semestre da Universidade, pensado para pessoas que necessitam de drones para alguma coisa e pessoas que oferecem serviços com drones.",
      imagem: "/assets/need_drone_app.png",
      tecnologias: ["Java", "Android", "XML", "Retrofit"],
      github: "https://github.com/Joannegton/NeedDroneApp",
      demo: "https://github.com/Joannegton/NeedDroneApp",
      categoria: "Mobile",
      categorias: ["mobile"],
      data: "08/2024",
    },
    {
      titulo: "Dia dos namorados",
      descricao:
        "Minha esposa gosta de cartas, mas decidi fazer algo diferente esse ano, aproveitando para treinar animações e estilização complexa.",
      imagem: "/assets/nams.png",
      tecnologias: ["React", "TypeScript", "Vite", "Tailwind CSS", "Motion"],
      github: "https://github.com/Joannegton/nams",
      demo: "https://keylacha.vercel.app",
      categoria: "Frontend",
      categorias: ["web"],
      data: "05/2025",
    },
    {
      titulo: "Curso de NodeJs e Express",
      descricao: "Material didático abrangente para ensino de criação de APIs com exercícios práticos e projetos reais, utilizados para palestrar sobre desenvolvimento backend na Universidade.",
      imagem: "/assets/curso.jpeg",
      tecnologias: ["NodeJs", "Express", "PostgreSQL", "Clean Code"],
      github: "https://github.com/Joannegton/Curso-NodeJs",
      demo: "https://github.com/Joannegton/Curso-NodeJs",
      categoria: "Educacional",
      categorias: ["api"],
      data: "04/2025",
    },
    // {
    //   titulo: "API de Gamificação Educacional",
    //   descricao:
    //     "Sistema completo de pontuação, conquistas e rankings para plataformas educacionais com mecânicas de jogos.",
    //   imagem: "/placeholder.svg?height=200&width=300",
    //   tecnologias: ["PHP", "Laravel", "MySQL", "Redis", "WebSockets"],
    //   github: "https://github.com",
    //   demo: "https://api-docs.com",
    //   categoria: "Backend",
    //   categorias: ["api"],
    //   data: "09/2024",
    // }, 
    // {
    //   titulo: "API de Gestão Escolar Completa",
    //   descricao:
    //     "API RESTful robusta para gerenciamento completo de instituições de ensino: alunos, professores, notas e frequência.",
    //   imagem: "/placeholder.svg?height=200&width=300",
    //   tecnologias: ["Node.js", "Express", "MongoDB", "JWT", "Swagger", "Redis"],
    //   github: "https://github.com",
    //   demo: "https://api-docs.com",
    //   categoria: "Backend",
    //   categorias: ["api"],
    //   data: "12/2024",
    // },
    {
      titulo: "Simulador Interativo de Funções Matemáticas",
      descricao:
        "Ferramenta educacional avançada em GeoGebra para visualização dinâmica de funções matemáticas complexas.",
      imagem: "/placeholder.svg?height=200&width=300",
      tecnologias: ["GeoGebra", "JavaScript", "HTML5", "CSS3", "WebGL"],
      github: "https://github.com",
      demo: "https://geogebra.org",
      categoria: "Educacional",
      categorias: ["web"],
      data: "04/2024",
    },
    {
      titulo: "EduBot - Assistente Virtual Educacional",
      descricao:
        "Chatbot inteligente para dúvidas acadêmicas usando GPT-4, base de conhecimento personalizada e integração com plataformas de ensino.",
      imagem: "/placeholder.svg?height=200&width=300",
      tecnologias: ["Python", "OpenAI API", "LangChain", "Streamlit", "Pinecone"],
      github: "https://github.com",
      demo: "https://chatbot-demo.com",
      categoria: "IA/ML",
      categorias: ["ai"],
      data: "12/2024",
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
      categorias: ["ai"],
      data: "12/2024",
    },
]


export { projetos, informacoesContato, linksSociais, links, habilidades, destaques, estatisticas, formacaoAcademica, experienciaProfissional, valores }