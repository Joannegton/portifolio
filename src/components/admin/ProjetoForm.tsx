"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Project } from "@/entities/Project.entity"

type FormData = Omit<Project, "id" | "createdAt" | "updatedAt">

const DEFAULTS: FormData = {
  titulo: "",
  descricao: "",
  imagem: "",
  tecnologias: [],
  github: null,
  demo: null,
  categoria: "",
  categorias: [],
  data: "",
  testavel: false,
  requestSlug: null,
  docsUrl: null,
  active: true,
  allowDisplay: true,
}

interface Props {
  initial?: Partial<Project>
  projectId?: string
}

export function ProjetoForm({ initial, projectId }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({ ...DEFAULTS, ...initial })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isEditing = Boolean(projectId)

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const payload = {
      ...form,
      tecnologias: typeof form.tecnologias === "string"
        ? (form.tecnologias as string).split(",").map((s) => s.trim()).filter(Boolean)
        : form.tecnologias,
      categorias: typeof form.categorias === "string"
        ? (form.categorias as string).split(",").map((s) => s.trim()).filter(Boolean)
        : form.categorias,
    }

    try {
      const url = isEditing ? `/api/projects/${projectId}` : "/api/projects"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error(await res.text())
      router.push("/admin/projetos")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!projectId) return
    if (!confirm("Excluir este projeto?")) return
    setLoading(true)
    await fetch(`/api/projects/${projectId}`, { method: "DELETE" })
    router.push("/admin/projetos")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div className="space-y-1">
        <Label>Título *</Label>
        <Input value={form.titulo} onChange={(e) => set("titulo", e.target.value)} required />
      </div>

      <div className="space-y-1">
        <Label>Descrição *</Label>
        <Textarea
          value={form.descricao}
          onChange={(e) => set("descricao", e.target.value)}
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Categoria *</Label>
          <Input value={form.categoria} onChange={(e) => set("categoria", e.target.value)} required />
        </div>
        <div className="space-y-1">
          <Label>Data (MM/AAAA) *</Label>
          <Input
            value={form.data}
            onChange={(e) => set("data", e.target.value)}
            placeholder="12/2024"
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label>Categorias (separadas por vírgula)</Label>
        <Input
          value={Array.isArray(form.categorias) ? form.categorias.join(", ") : form.categorias ?? ""}
          onChange={(e) => set("categorias", e.target.value.split(",").map((s) => s.trim()))}
          placeholder="web, api, mobile"
        />
      </div>

      <div className="space-y-1">
        <Label>Tecnologias (separadas por vírgula)</Label>
        <Input
          value={Array.isArray(form.tecnologias) ? form.tecnologias.join(", ") : form.tecnologias ?? ""}
          onChange={(e) => set("tecnologias", e.target.value.split(",").map((s) => s.trim()))}
          placeholder="TypeScript, Next.js, PostgreSQL"
        />
      </div>

      <div className="space-y-1">
        <Label>Imagem (path ou URL)</Label>
        <Input value={form.imagem} onChange={(e) => set("imagem", e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>GitHub</Label>
          <Input value={form.github ?? ""} onChange={(e) => set("github", e.target.value || null)} />
        </div>
        <div className="space-y-1">
          <Label>Demo</Label>
          <Input value={form.demo ?? ""} onChange={(e) => set("demo", e.target.value || null)} />
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-3">
        <p className="text-sm font-medium">Configurações de exibição</p>
        <div className="grid grid-cols-3 gap-4">
          {(
            [
              { key: "active", label: "Ativo" },
              { key: "allowDisplay", label: "Visível no portfólio" },
              { key: "testavel", label: "Testável" },
            ] as { key: keyof FormData; label: string }[]
          ).map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(form[key])}
                onChange={(e) => set(key, e.target.checked as FormData[typeof key])}
                className="h-4 w-4"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>

        {form.testavel && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <Label>Request Slug</Label>
              <Input
                value={form.requestSlug ?? ""}
                onChange={(e) => set("requestSlug", e.target.value || null)}
                placeholder="auth-hub"
              />
            </div>
            <div className="space-y-1">
              <Label>Docs URL</Label>
              <Input
                value={form.docsUrl ?? ""}
                onChange={(e) => set("docsUrl", e.target.value || null)}
                placeholder="https://auth-demo.joannegton.com/docs"
              />
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar projeto"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        {isEditing && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="ml-auto"
          >
            Excluir
          </Button>
        )}
      </div>
    </form>
  )
}
