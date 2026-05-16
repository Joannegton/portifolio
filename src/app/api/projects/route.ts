import { NextRequest, NextResponse } from "next/server"
import { getProjectRepository } from "@/lib/db"

export async function GET() {
  try {
    const repo = await getProjectRepository()
    const projects = await repo.find({
      where: { allowDisplay: true, active: true },
      order: { createdAt: "DESC" },
    })
    return NextResponse.json(projects, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
    })
  } catch (error) {
    console.error("GET /api/projects error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const repo = await getProjectRepository()
    const project = repo.create({
      ...body,
      active: body.active ?? true,
      allowDisplay: body.allowDisplay ?? true,
      testavel: body.testavel ?? false,
    })
    const saved = await repo.save(project)
    return NextResponse.json(saved, { status: 201 })
  } catch (error) {
    console.error("POST /api/projects error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
