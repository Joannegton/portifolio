import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { getAccessRequestRepository, getProjectRepository } from "@/lib/db"
import {
  sendTelegramAlert,
  sendEmail,
  buildApprovalEmail,
  buildRejectionEmail,
} from "@/lib/notifications"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await req.json()
    const action: "approve" | "reject" = body.action

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json({ error: "action deve ser 'approve' ou 'reject'" }, { status: 400 })
    }

    const repo = await getAccessRequestRepository()
    const request = await repo.findOneBy({ id })
    if (!request) {
      return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 })
    }

    const projectRepo = await getProjectRepository()
    const project = await projectRepo.findOneBy({ id: request.projectId })
    const projectTitle = project?.titulo ?? "Projeto"
    const slug = project?.requestSlug ?? id

    if (action === "approve") {
      const token = uuidv4()
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      await repo.update(id, { status: "APPROVED", token, expiresAt })

      const link = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://joannegton.com"}/demo/${slug}?token=${token}`

      await Promise.allSettled([
        sendTelegramAlert(`✅ Acesso aprovado para <b>${request.nome}</b> no projeto <b>${projectTitle}</b>`),
        sendEmail({
          to: request.email,
          subject: `Acesso aprovado — ${projectTitle}`,
          html: buildApprovalEmail(request.nome, projectTitle, link),
        }),
      ])
    } else {
      await repo.update(id, { status: "REJECTED" })

      await Promise.allSettled([
        sendTelegramAlert(`❌ Acesso rejeitado para <b>${request.nome}</b> no projeto <b>${projectTitle}</b>`),
        sendEmail({
          to: request.email,
          subject: `Solicitação não aprovada — ${projectTitle}`,
          html: buildRejectionEmail(request.nome, projectTitle),
        }),
      ])
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[PATCH /api/access-requests/:id]", err)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
