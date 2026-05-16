import { EntitySchema } from "typeorm"

export interface Project {
  id: string
  titulo: string
  descricao: string
  imagem: string
  tecnologias: string[]
  github: string | null
  demo: string | null
  categoria: string
  categorias: string[]
  data: string
  testavel: boolean
  requestSlug: string | null
  docsUrl: string | null
  active: boolean
  allowDisplay: boolean
  createdAt: Date
  updatedAt: Date
}

export const ProjectSchema = new EntitySchema<Project>({
  name: "Project",
  tableName: "projects",
  columns: {
    id: { type: "uuid", primary: true, generated: "uuid" },
    titulo: { type: "varchar" },
    descricao: { type: "text" },
    imagem: { type: "varchar" },
    tecnologias: { type: "simple-array" },
    github: { type: "varchar", nullable: true },
    demo: { type: "varchar", nullable: true },
    categoria: { type: "varchar" },
    categorias: { type: "simple-array" },
    data: { type: "varchar" },
    testavel: { type: "boolean", default: false },
    requestSlug: { name: "request_slug", type: "varchar", nullable: true, unique: true },
    docsUrl: { name: "docs_url", type: "varchar", nullable: true },
    active: { type: "boolean", default: true },
    allowDisplay: { name: "allow_display", type: "boolean", default: true },
    createdAt: { name: "created_at", type: "timestamp", createDate: true },
    updatedAt: { name: "updated_at", type: "timestamp", updateDate: true },
  },
})
