import { DataSource } from "typeorm"
import { ProjectSchema } from "@/entities/Project.entity"
import { AccessRequestSchema } from "@/entities/AccessRequest.entity"
import { InitialSchema1748000000000 } from "@/migrations/InitialSchema"
import { SeedProjects1748000000001 } from "@/migrations/SeedProjects"

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [ProjectSchema, AccessRequestSchema],
  migrations: [InitialSchema1748000000000, SeedProjects1748000000001],
  migrationsTableName: "typeorm_migrations",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
})
