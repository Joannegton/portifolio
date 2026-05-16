import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendTelegramAlert(message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
  })
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) return

  await resend.emails.send({
    from: "Portfolio <noreply@joannegton.com>",
    to,
    subject,
    html,
  })
}

export function buildConfirmationEmail(nome: string, projeto: string): string {
  return `
    <p>Olá, <strong>${nome}</strong>!</p>
    <p>Recebemos sua solicitação de acesso ao projeto <strong>${projeto}</strong>.</p>
    <p>Você receberá uma resposta em breve.</p>
    <p>— João Annegton</p>
  `
}

export function buildApprovalEmail(nome: string, projeto: string, link: string): string {
  return `
    <p>Olá, <strong>${nome}</strong>!</p>
    <p>Sua solicitação de acesso ao projeto <strong>${projeto}</strong> foi <strong>aprovada</strong>!</p>
    <p>Acesse a documentação interativa pelo link abaixo (válido por 7 dias):</p>
    <p><a href="${link}">${link}</a></p>
    <p>— João Annegton</p>
  `
}

export function buildRejectionEmail(nome: string, projeto: string): string {
  return `
    <p>Olá, <strong>${nome}</strong>!</p>
    <p>Infelizmente sua solicitação de acesso ao projeto <strong>${projeto}</strong> não foi aprovada no momento.</p>
    <p>Obrigado pelo interesse!</p>
    <p>— João Annegton</p>
  `
}
