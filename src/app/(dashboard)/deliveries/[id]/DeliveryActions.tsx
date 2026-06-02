"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Pencil, Trash2, FileDown, Receipt, CheckCircle } from "lucide-react"
import Link from "next/link"
import type { DocumentStatus } from "@prisma/client"
import { SendEmailDialog } from "@/components/documents/SendEmailDialog"

interface Delivery {
  id: string
  status: DocumentStatus
  clientId: string
  title: string
  issueDate: Date
  deliveryDate: Date | null
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

export function DeliveryActions({ delivery }: { delivery: Delivery }) {
  const router = useRouter()

  async function updateStatus(status: DocumentStatus) {
    const res = await fetch(`/api/deliveries/${delivery.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...delivery, status, lineItems: delivery.lineItems }),
    })
    if (res.ok) { toast.success("ステータスを更新しました"); router.refresh() }
    else toast.error("更新に失敗しました")
  }

  async function deleteDelivery() {
    if (!confirm("この納品書を削除しますか？")) return
    const res = await fetch(`/api/deliveries/${delivery.id}`, { method: "DELETE" })
    if (res.ok) { toast.success("削除しました"); router.push("/deliveries") }
    else toast.error("削除に失敗しました")
  }

  async function convertToInvoice() {
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: delivery.clientId,
        deliveryId: delivery.id,
        title: delivery.title,
        issueDate: new Date().toISOString().split("T")[0],
        taxRate: delivery.taxRate,
        subtotal: delivery.subtotal,
        taxAmount: delivery.taxAmount,
        total: delivery.total,
        notes: delivery.notes,
        lineItems: delivery.lineItems.map((li: any) => ({
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
      const invoice = await res.json()
      toast.success("請求書を作成しました")
      router.push(`/invoices/${invoice.id}`)
    } else {
      toast.error("変換に失敗しました")
    }
  }

  const next = nextStatus[delivery.status]

  return (
    <div className="flex flex-wrap gap-2">
      {next && (
        <Button variant="outline" size="sm" onClick={() => updateStatus(next)}>
          <CheckCircle className="h-4 w-4 mr-2" />{statusLabel[delivery.status]}
        </Button>
      )}
      <Button variant="outline" size="sm" onClick={convertToInvoice}>
        <Receipt className="h-4 w-4 mr-2" />請求書に変換
      </Button>
      <SendEmailDialog type="delivery" documentId={delivery.id} documentTitle={delivery.title} clientEmail={delivery.client?.email} />
      <Button variant="outline" size="sm" asChild>
        <a href={`/api/deliveries/${delivery.id}/pdf`} target="_blank">
          <FileDown className="h-4 w-4 mr-2" />PDF出力
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <Link href={`/deliveries/${delivery.id}/edit`}>
          <Pencil className="h-4 w-4 mr-2" />編集
        </Link>
      </Button>
      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={deleteDelivery}>
        <Trash2 className="h-4 w-4 mr-2" />削除
      </Button>
    </div>
  )
}
