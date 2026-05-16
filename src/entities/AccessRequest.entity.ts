import { EntitySchema } from "typeorm"

export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED"

export interface AccessRequest {
  id: string
  projectId: string
  nome: string
  email: string
  motivo: string | null
  status: RequestStatus
  token: string | null
  expiresAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export const AccessRequestSchema = new EntitySchema<AccessRequest>({
  name: "AccessRequest",
  tableName: "access_requests",
  columns: {
    id: { type: "uuid", primary: true, generated: "uuid" },
    projectId: { name: "project_id", type: "uuid" },
    nome: { type: "varchar" },
    email: { type: "varchar" },
    motivo: { type: "text", nullable: true },
    status: { type: "varchar", default: "PENDING" },
    token: { type: "varchar", nullable: true, unique: true },
    expiresAt: { name: "expires_at", type: "timestamp", nullable: true },
    createdAt: { name: "created_at", type: "timestamp", createDate: true },
    updatedAt: { name: "updated_at", type: "timestamp", updateDate: true },
  },
})
