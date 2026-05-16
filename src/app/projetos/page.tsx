import { getProjectRepository } from "@/lib/db"
import { ProjetosClient } from "@/components/ProjetosClient"

export const dynamic = "force-dynamic"

export default async function ProjetosPage() {
  const repo = await getProjectRepository()
  const projetos = await repo.find({
    where: { allowDisplay: true, active: true },
    order: { createdAt: "DESC" },
  })

  return <ProjetosClient projetos={projetos} />
}
