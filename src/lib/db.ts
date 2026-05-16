import { AppDataSource } from "./data-source"
import { ProjectSchema, type Project } from "@/entities/Project.entity"
import { AccessRequestSchema, type AccessRequest } from "@/entities/AccessRequest.entity"

async function getDataSource() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
  }
  return AppDataSource
}

export async function getProjectRepository() {
  const ds = await getDataSource()
  return ds.getRepository<Project>(ProjectSchema)
}

export async function getAccessRequestRepository() {
  const ds = await getDataSource()
  return ds.getRepository<AccessRequest>(AccessRequestSchema)
}
