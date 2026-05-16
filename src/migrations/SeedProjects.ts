import { MigrationInterface, QueryRunner } from "typeorm"

const projects = [
  {
    titulo: "Maleficis Tattoo",
    descricao: "Meu primeiro projeto da faculdade, foi inspirado nos trabalhos da minha esposa, que é tatuadora. O site foi desenvolvido com HTML, Css, JavaScript e Java Jsp, e tem como objetivo apresentar o portfólio dela.",
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
    descricao: "Api para avaliação de crédito, desenvolvida com Java Spring Boot. A api é capaz de avaliar o crédito de um cliente, também listar os clientes com crédito aprovado. Projeto de base para aprendizado de Spring Boot.",
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
    github: "https://github.com/Joannegton/psy_terapeuta_virtual/tree/gemini-api",
    demo: "https://drive.google.com/drive/folders/1TIPXgQI4f-3QaV8vPWJKFaBxDNTY-Nfo?usp=sharing",
    categoria: "Mobile App",
    categorias: ["mobile", "ai"],
    data: "07/2025",
  },
  {
    titulo: "Need Drone Front",
    descricao: "Interface web para unir pessoas que necessitam de drones para alguma coisa e pessoas que oferecem serviços com drones.",
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
    descricao: "Api para integrar a interface web com o backend, unindo pessoas que necessitam de drones para alguma coisa e pessoas que oferecem serviços com drones.",
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
    descricao: "App ganhador do melhor projeto do semestre da Universidade, pensado para pessoas que necessitam de drones para alguma coisa e pessoas que oferecem serviços com drones.",
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
    descricao: "Minha esposa gosta de cartas, mas decidi fazer algo diferente esse ano, aproveitando para treinar animações e estilização complexa.",
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
  {
    titulo: "Simulador Interativo de Funções Matemáticas",
    descricao: "Ferramenta educacional avançada em GeoGebra para visualização dinâmica de funções matemáticas complexas.",
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
    descricao: "Chatbot inteligente para dúvidas acadêmicas usando GPT-4, base de conhecimento personalizada e integração com plataformas de ensino.",
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
    descricao: "IA avançada para recomendação personalizada de conteúdos educacionais baseada no perfil e histórico do aluno.",
    imagem: "/placeholder.svg?height=200&width=300",
    tecnologias: ["Python", "TensorFlow", "Pandas", "Scikit-learn", "Apache Spark"],
    github: "https://github.com",
    demo: "https://demo.com",
    categoria: "IA/ML",
    categorias: ["ai"],
    data: "12/2024",
  },
]

export class SeedProjects1748000000001 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    for (const p of projects) {
      await queryRunner.query(
        `INSERT INTO projects
          (titulo, descricao, imagem, tecnologias, github, demo, categoria, categorias, data, active, allow_display)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, true)
         ON CONFLICT DO NOTHING`,
        [
          p.titulo,
          p.descricao,
          p.imagem,
          p.tecnologias.join(","),
          p.github ?? null,
          p.demo ?? null,
          p.categoria,
          p.categorias.join(","),
          p.data,
        ]
      )
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM projects`)
  }
}
