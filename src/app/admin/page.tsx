import Link from "next/link"
import { getProjectRepository } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboard() {
  const repo = await getProjectRepository()
  const total = await repo.count()
  const ativos = await repo.count({ where: { active: true } })
  const visiveis = await repo.count({ where: { allowDisplay: true } })
  const testaveis = await repo.count({ where: { testavel: true } })

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <form action="/api/admin/session" method="POST">
            <Button
              variant="outline"
              onClick={async () => {
                await fetch("/api/admin/session", { method: "DELETE" })
                window.location.href = "/admin/login"
              }}
              type="button"
            >
              Sair
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: total },
            { label: "Ativos", value: ativos },
            { label: "Visíveis", value: visiveis },
            { label: "Testáveis", value: testaveis },
          ].map(({ label, value }) => (
            <Card key={label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-4">
          <Button asChild>
            <Link href="/admin/projetos">Gerenciar Projetos</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
