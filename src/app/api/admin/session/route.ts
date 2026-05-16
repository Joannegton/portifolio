import { NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const { token } = await req.json()

  try {
    await verifyJwt(token)
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24h
    path: "/",
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete("admin_token")
  return res
}
