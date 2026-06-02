"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Pencil, Trash2, FileDown, Package, CheckCircle } from "lucide-react"
import Link from "next/link"
import type { DocumentStatus } from "@prisma/client"
import { SendEmailDialog } from "@/components/documents/SendEmailDialog"

interface Quote {
  id: string
  status: DocumentStatus
  quoteNumber: string
  title: string
  clientId: string
  issueDate: Date
  expiryDate: Date | null
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

export function QuoteActions({ quote }: { quote: Quote }) {
  const router = useRouter()

  async function updateStatus(status: DocumentStatus) {
    const res = await fetch(`/api/quotes/${quote.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...quote, status, lineItems: quote.lineItems }),
    })
    if (res.ok) {
      toast.success("ステータスを更新しました")
      router.refresh()
    } else {
      toast.error("更新に失敗しました")
    }
  }

  async function deleteQuote() {
    if (!confirm("この見積書を削除しますか？")) return
    const res = await fetch(`/api/quotes/${quote.id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("削除しました")
      router.push("/quotes")
    } else {
      toast.error("削除に失敗しました")
    }
  }

  async function convertToDelivery() {
    const res = await fetch("/api/deliveries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: quote.clientId,
        quoteId: quote.id,
        title: quote.title,
        issueDate: new Date().toISOString().split("T")[0],
        taxRate: quote.taxRate,
        subtotal: quote.subtotal,
        taxAmount: quote.taxAmount,
        total: quote.total,
        notes: quote.notes,
        lineItems: quote.lineItems.map((li: any) => ({
          description: li.description,
          quantity: li.quantity,
          unit: li.unit,
          unitPrice: li.unitPrice,
          amount: li.amount,
          sortOrder: li.sortOrder,
        })),
      }),
    })
    if (res.ok) {
      const delivery = await res.json()
      toast.success("納品書を作成しました")
      router.push(`/deliveries/${delivery.id}`)
    } else {
      toast.error("変換に失敗しました")
    }
  }

  const next = nextStatus[quote.status]

  return (
    <div className="flex flex-wrap gap-2">
      {next && (
        <Button variant="outline" size="sm" onClick={() => updateStatus(next)}>
          <CheckCircle className="h-4 w-4 mr-2" />
          {statusLabel[quote.status]}
        </Button>
      )}
      <Button variant="outline" size="sm" onClick={convertToDelivery}>
        <Package className="h-4 w-4 mr-2" />
        納品書に変換
      </Button>
      <SendEmailDialog type="quote" documentId={quote.id} documentTitle={quote.title} clientEmail={quote.client?.email} />
      <Button variant="outline" size="sm" asChild>
        <a href={`/api/quotes/${quote.id}/pdf`} target="_blank">
          <FileDown className="h-4 w-4 mr-2" />
          PDF出力
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <Link href={`/quotes/${quote.id}/edit`}>
          <Pencil className="h-4 w-4 mr-2" />
          編集
        </Link>
      </Button>
      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={deleteQuote}>
        <Trash2 className="h-4 w-4 mr-2" />
        削除
      </Button>
    </div>
  )
}
