import { getAccessRequestRepository, getProjectRepository } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { ApproveRejectButtons } from "@/components/admin/ApproveRejectButtons";

export const dynamic = "force-dynamic";

const statusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  PENDING: { label: "Pendente", variant: "secondary" },
  APPROVED: { label: "Aprovado", variant: "default" },
  REJECTED: { label: "Rejeitado", variant: "destructive" },
};

export default async function PedidosPage() {
  const repo = await getAccessRequestRepository();
  const projectRepo = await getProjectRepository();

  const pedidos = await repo.find({ order: { createdAt: "DESC" } });

  const projectIds = [...new Set(pedidos.map((p) => p.projectId))];
  const projects = await Promise.all(
    projectIds.map((id) => projectRepo.findOneBy({ id })),
  );
  const projectMap = Object.fromEntries(
    projects.filter(Boolean).map((p) => [p!.id, p!.titulo]),
  );

  const pendentes = pedidos.filter((p) => p.status === "PENDING").length;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Pedidos de Acesso</h1>
          {pendentes > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {pendentes} pedido{pendentes > 1 ? "s" : ""} aguardando aprovação
            </p>
          )}
        </div>
      </div>

      {pedidos.length === 0 ? (
        <p className="text-muted-foreground">Nenhum pedido recebido ainda.</p>
      ) : (
        <div className="rounded-md border overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Nome</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Projeto</th>
                <th className="px-4 py-3 text-left font-medium">Motivo</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Data</th>
                <th className="px-4 py-3 text-left font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => {
                const { label, variant } = statusLabels[pedido.status] ?? {
                  label: pedido.status,
                  variant: "outline",
                };
                return (
                  <tr key={pedido.id} className="border-b hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{pedido.nome}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {pedido.email}
                    </td>
                    <td className="px-4 py-3">
                      {projectMap[pedido.projectId] ?? pedido.projectId}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                      {pedido.motivo ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={variant}>{label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(pedido.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3">
                      {pedido.status === "PENDING" && (
                        <ApproveRejectButtons id={pedido.id} />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
