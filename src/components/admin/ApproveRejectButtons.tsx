"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"

export function ApproveRejectButtons({ id }: { id: string }) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null)
  const router = useRouter()

  async function handle(action: "approve" | "reject") {
    setLoading(action)
    try {
      await fetch(`/api/access-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      router.refresh()
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="default"
        onClick={() => handle("approve")}
        disabled={loading !== null}
      >
        {loading === "approve" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => handle("reject")}
        disabled={loading !== null}
      >
        {loading === "reject" ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
      </Button>
    </div>
  )
}
