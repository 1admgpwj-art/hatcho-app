"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Pencil, Trash2, FileDown, CheckCircle, Banknote } from "lucide-react"
import Link from "next/link"
import type { DocumentStatus } from "@prisma/client"
import { SendEmailDialog } from "@/components/documents/SendEmailDialog"

interface Invoice {
  id: string
  status: DocumentStatus
  isPaid: boolean
  clientId: string
  title: string
  issueDate: Date
  dueDate: Date | null
  taxRate: number
  subtotal: number
  taxAmount: number
  total: number
  notes: string | null
  lineItems: any[]
  client?: { email?: string | null }
}

const nextStatus: Record<DocumentStatus, DocumentStatus | null> = {
  DRAFT: "SENT",
  SENT: "APPROVED",
  APPROVED: "COMPLETED",
  COMPLETED: null,
}

const statusLabel: Record<DocumentStatus, string> = {
  DRAFT: "送付済みにする",
  SENT: "承認済みにする",
  APPROVED: "完了にする",
  COMPLETED: "",
}

export function InvoiceActions({ invoice }: { invoice: Invoice }) {
  const router = useRouter()

  async function updateStatus(status: DocumentStatus) {
    const res = await fetch(`/api/invoices/${invoice.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...invoice, status, lineItems: invoice.lineItems }),
    })
    if (res.ok) { toast.success("ステータスを更新しました"); router.refresh() }
    else toast.error("更新に失敗しました")
  }

  async function markAsPaid() {
    const res = await fetch(`/api/invoices/${invoice.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...invoice,
        isPaid: !invoice.isPaid,
        paidAt: !invoice.isPaid ? new Date().toISOString() : null,
        lineItems: invoice.lineItems,
      }),
    })
    if (res.ok) {
      toast.success(invoice.isPaid ? "未入金に戻しました" : "入金済みにしました")
      router.refresh()
    } else {
      toast.error("更新に失敗しました")
    }
  }

  async function deleteInvoice() {
    if (!confirm("この請求書を削除しますか？")) return
    const res = await fetch(`/api/invoices/${invoice.id}`, { method: "DELETE" })
    if (res.ok) { toast.success("削除しました"); router.push("/invoices") }
    else toast.error("削除に失敗しました")
  }

  const next = nextStatus[invoice.status]

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={markAsPaid}
        className={invoice.isPaid ? "" : "text-green-700 border-green-200 hover:bg-green-50"}
      >
        <Banknote className="h-4 w-4 mr-2" />
        {invoice.isPaid ? "未入金に戻す" : "入金済みにする"}
      </Button>
      {next && (
        <Button variant="outline" size="sm" onClick={() => updateStatus(next)}>
          <CheckCircle className="h-4 w-4 mr-2" />{statusLabel[invoice.status]}
        </Button>
      )}
      <SendEmailDialog type="invoice" documentId={invoice.id} documentTitle={invoice.title} clientEmail={invoice.client?.email} />
      <Button variant="outline" size="sm" asChild>
        <a href={`/api/invoices/${invoice.id}/pdf`} target="_blank">
          <FileDown className="h-4 w-4 mr-2" />PDF出力
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <Link href={`/invoices/${invoice.id}/edit`}>
          <Pencil className="h-4 w-4 mr-2" />編集
        </Link>
      </Button>
      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={deleteInvoice}>
        <Trash2 className="h-4 w-4 mr-2" />削除
      </Button>
    </div>
  )
}
