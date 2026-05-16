import type { ReactNode } from "react"

export const metadata = { title: "Admin | Portfolio" }

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
