import { NextRequest, NextResponse } from "next/server"
import { getAccessRequestRepository, getProjectRepository } from "@/lib/db"
import {
  sendTelegramAlert,
  sendEmail,
  buildConfirmationEmail,
} from "@/lib/notifications"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { projectId, nome, email, motivo } = body

    if (!projectId || !nome || !email) {
      return NextResponse.json({ error: "projectId, nome e email são obrigatórios" }, { status: 400 })
    }

    const projectRepo = await getProjectRepository()
    const project = await projectRepo.findOneBy({ id: projectId })
    if (!project) {
      return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 })
    }
    if (!project.testavel) {
      return NextResponse.json({ error: "Este projeto não aceita solicitações de acesso" }, { status: 400 })
    }

    const repo = await getAccessRequestRepository()
    const request = repo.create({ projectId, nome, email, motivo: motivo ?? null, status: "PENDING" })
    await repo.save(request)

    await Promise.allSettled([
      sendTelegramAlert(
        `🔔 <b>Nova solicitação de acesso</b>\n` +
        `Projeto: <b>${project.titulo}</b>\n` +
        `Nome: ${nome}\n` +
        `Email: ${email}\n` +
        (motivo ? `Motivo: ${motivo}` : ""),
      ),
      sendEmail({
        to: email,
        subject: `Solicitação recebida — ${project.titulo}`,
        html: buildConfirmationEmail(nome, project.titulo),
      }),
    ])

    return NextResponse.json({ id: request.id }, { status: 201 })
  } catch (err) {
    console.error("[POST /api/access-requests]", err)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
