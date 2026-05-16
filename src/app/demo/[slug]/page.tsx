import { notFound, redirect } from "next/navigation"
import { getAccessRequestRepository, getProjectRepository } from "@/lib/db"

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ token?: string }>
}

export default async function DemoGatewayPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { token } = await searchParams

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Token não fornecido</h1>
          <p className="text-muted-foreground">
            Este link requer um token de acesso válido. Verifique o e-mail que você recebeu.
          </p>
        </div>
      </main>
    )
  }

  const repo = await getAccessRequestRepository()
  const request = await repo.findOneBy({ token })

  if (!request) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Token inválido</h1>
          <p className="text-muted-foreground">
            Este token de acesso não foi encontrado ou já foi removido.
          </p>
        </div>
      </main>
    )
  }

  if (request.status !== "APPROVED") {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Acesso não aprovado</h1>
          <p className="text-muted-foreground">
            Sua solicitação ainda está pendente ou foi rejeitada.
          </p>
        </div>
      </main>
    )
  }

  if (request.expiresAt && new Date() > request.expiresAt) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Token expirado</h1>
          <p className="text-muted-foreground">
            Seu acesso expirou. Envie uma nova solicitação na página de projetos.
          </p>
        </div>
      </main>
    )
  }

  const projectRepo = await getProjectRepository()
  const project = await projectRepo.findOneBy({ requestSlug: slug })

  if (!project || !project.docsUrl) {
    notFound()
  }

  redirect(project.docsUrl)
}
