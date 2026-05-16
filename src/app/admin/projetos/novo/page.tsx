export const dynamic = "force-dynamic"
import Link from "next/link"
import { ProjetoForm } from "@/components/admin/ProjetoForm"

export default function NovoProjeto() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/projetos" className="text-sm text-muted-foreground hover:underline">
          ← Projetos
        </Link>
        <h1 className="text-2xl font-bold mt-1 mb-6">Novo Projeto</h1>
        <ProjetoForm />
      </div>
    </div>
  )
}
