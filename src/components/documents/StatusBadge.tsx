import { Badge } from "@/components/ui/badge"
import type { DocumentStatus } from "@prisma/client"

const config: Record<DocumentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  DRAFT: { label: "下書き", variant: "secondary" },
  SENT: { label: "送付済み", variant: "default" },
  APPROVED: { label: "承認済み", variant: "default" },
  COMPLETED: { label: "完了", variant: "default" },
}

export function StatusBadge({ status }: { status: DocumentStatus }) {
  const { label, variant } = config[status]
  const colorClass =
    status === "DRAFT" ? "bg-slate-100 text-slate-600" :
    status === "SENT" ? "bg-blue-100 text-blue-700" :
    status === "APPROVED" ? "bg-green-100 text-green-700" :
    "bg-purple-100 text-purple-700"

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  )
}
