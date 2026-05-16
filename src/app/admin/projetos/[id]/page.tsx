import Link from "next/link"
import { notFound } from "next/navigation"
import { getProjectRepository } from "@/lib/db"
import { ProjetoForm } from "@/components/admin/ProjetoForm"

export default async function EditarProjeto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const repo = await getProjectRepository()
  const project = await repo.findOneBy({ id })

  if (!project) notFound()

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/projetos" className="text-sm text-muted-foreground hover:underline">
          ← Projetos
        </Link>
        <h1 className="text-2xl font-bold mt-1 mb-6">Editar: {project.titulo}</h1>
        <ProjetoForm initial={project} projectId={project.id} />
      </div>
    </div>
  )
}
