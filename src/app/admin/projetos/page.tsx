import Link from "next/link"
import { getProjectRepository } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function AdminProjetos() {
  const repo = await getProjectRepository()
  const projetos = await repo.find({ order: { createdAt: "DESC" } })

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/admin" className="text-sm text-muted-foreground hover:underline">
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold mt-1">Projetos ({projetos.length})</h1>
          </div>
          <Button asChild>
            <Link href="/admin/projetos/novo">+ Novo Projeto</Link>
          </Button>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Título</th>
                <th className="text-left p-3 font-medium">Categoria</th>
                <th className="text-left p-3 font-medium">Data</th>
                <th className="text-center p-3 font-medium">Ativo</th>
                <th className="text-center p-3 font-medium">Visível</th>
                <th className="text-center p-3 font-medium">Testável</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {projetos.map((p, i) => (
                <tr
                  key={p.id}
                  className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}
                >
                  <td className="p-3 font-medium max-w-[200px] truncate">{p.titulo}</td>
                  <td className="p-3">
                    <Badge variant="outline">{p.categoria}</Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">{p.data}</td>
                  <td className="p-3 text-center">
                    <Badge variant={p.active ? "default" : "secondary"}>
                      {p.active ? "Sim" : "Não"}
                    </Badge>
                  </td>
                  <td className="p-3 text-center">
                    <Badge variant={p.allowDisplay ? "default" : "secondary"}>
                      {p.allowDisplay ? "Sim" : "Não"}
                    </Badge>
                  </td>
                  <td className="p-3 text-center">
                    <Badge variant={p.testavel ? "default" : "outline"}>
                      {p.testavel ? "Sim" : "Não"}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/projetos/${p.id}`}>Editar</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
