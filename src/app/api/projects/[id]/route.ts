import { NextRequest, NextResponse } from "next/server"
import { getProjectRepository } from "@/lib/db"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const repo = await getProjectRepository()
    const project = await repo.findOneBy({ id })
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(project)
  } catch (error) {
    console.error("GET /api/projects/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const repo = await getProjectRepository()
    const project = await repo.findOneBy({ id })
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 })
    await repo.save({ ...project, ...body, id })
    const updated = await repo.findOneBy({ id })
    return NextResponse.json(updated)
  } catch (error) {
    console.error("PUT /api/projects/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const repo = await getProjectRepository()
    const project = await repo.findOneBy({ id })
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 })
    await repo.remove(project)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
