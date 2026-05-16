import { NextRequest, NextResponse } from "next/server"
import { getAccessRequestRepository } from "@/lib/db"
import { sendEmail } from "@/lib/notifications"

function generatePassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ"
  const lower = "abcdefghjkmnpqrstuvwxyz"
  const digits = "23456789"
  const symbols = "!@#$%&*"
  const all = upper + lower + digits + symbols

  const pick = (set: string) => set[Math.floor(Math.random() * set.length)]
  const required = [pick(upper), pick(lower), pick(digits), pick(symbols)]
  const extra = Array.from({ length: 4 }, () => pick(all))
  return [...required, ...extra].sort(() => Math.random() - 0.5).join("")
}

async function answerCallback(callbackQueryId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return
  await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
  })
}

async function editTelegramMessage(chatId: number, messageId: number, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return
  await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId, text, parse_mode: "HTML" }),
  })
}

function buildCredentialsEmail(nome: string, projeto: string, email: string, password: string): string {
  return `
    <p>Olá, <strong>${nome}</strong>!</p>
    <p>Seu acesso ao projeto <strong>${projeto}</strong> foi liberado.</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Senha:</strong> ${password}</p>
    <p>— Joannegton</p>
  `
}

export async function POST(req: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET
  if (secret) {
    const incoming = req.headers.get("x-telegram-bot-api-secret-token")
    if (incoming !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: true })
  }

  const callbackQuery = body.callback_query as {
    id: string
    data?: string
    message?: { chat: { id: number }; message_id: number; text?: string }
  } | undefined

  if (!callbackQuery?.data) return NextResponse.json({ ok: true })

  const { id: callbackId, data, message } = callbackQuery
  const chatId = message?.chat.id
  const messageId = message?.message_id
  const originalText = message?.text ?? ""

  const [action, requestId] = data.split(":")
  if (!requestId) {
    await answerCallback(callbackId, "Dados inválidos")
    return NextResponse.json({ ok: true })
  }

  const repo = await getAccessRequestRepository()
  const request = await repo.findOneBy({ id: requestId })
  if (!request) {
    await answerCallback(callbackId, "Solicitação não encontrada")
    return NextResponse.json({ ok: true })
  }

  if (action === "criar_usuario") {
    const authUrl = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL
    const serviceId = process.env.AUTH_SERVICE_ID
    if (!authUrl || !serviceId) {
      await answerCallback(callbackId, "Auth service não configurado")
      return NextResponse.json({ ok: true })
    }

    const password = generatePassword()
    try {
      const res = await fetch(`${authUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: request.email, password, serviceId }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        await answerCallback(callbackId, `Erro ao criar usuário: ${err.message ?? res.status}`)
        return NextResponse.json({ ok: true })
      }
    } catch (err) {
      await answerCallback(callbackId, "Falha ao conectar no auth service")
      return NextResponse.json({ ok: true })
    }

    await sendEmail({
      to: request.email,
      subject: "Suas credenciais de acesso",
      html: buildCredentialsEmail(request.nome, requestId, request.email, password),
    })

    await answerCallback(callbackId, "Usuário criado e credenciais enviadas!")
    if (chatId && messageId) {
      await editTelegramMessage(chatId, messageId, `${originalText}\n\n✅ Usuário criado — credenciais enviadas para ${request.email}`)
    }
  } else if (action === "mandar_existente") {
    const testEmail = process.env.TEST_USER_EMAIL
    const testPassword = process.env.TEST_USER_PASSWORD
    if (!testEmail || !testPassword) {
      await answerCallback(callbackId, "Usuário de teste não configurado")
      return NextResponse.json({ ok: true })
    }

    await sendEmail({
      to: request.email,
      subject: "Suas credenciais de acesso",
      html: buildCredentialsEmail(request.nome, requestId, testEmail, testPassword),
    })

    await answerCallback(callbackId, "Credenciais do usuário de teste enviadas!")
    if (chatId && messageId) {
      await editTelegramMessage(chatId, messageId, `${originalText}\n\n✅ Credenciais de teste enviadas para ${request.email}`)
    }
  }

  return NextResponse.json({ ok: true })
}
