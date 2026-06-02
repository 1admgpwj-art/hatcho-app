"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineItemsTable } from "@/components/documents/LineItemsTable"
import { formatCurrency, calcTotals } from "@/lib/utils"
import { toast } from "sonner"
import type { LineItem } from "@/types"

interface Client {
  id: string
  name: string
  contactPerson?: string | null
}

interface Props {
  type: "quote" | "delivery" | "invoice"
  initialData?: any
  onSubmit: (data: any) => Promise<void>
  submitLabel?: string
}

const typeLabel = {
  quote: "見積書",
  delivery: "納品書",
  invoice: "請求書",
}

export function DocumentForm({ type, initialData, onSubmit, submitLabel }: Props) {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [clientId, setClientId] = useState(initialData?.clientId ?? "")
  const [title, setTitle] = useState(initialData?.title ?? "")
  const [issueDate, setIssueDate] = useState(
    initialData?.issueDate ? new Date(initialData.issueDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
  )
  const [secondDate, setSecondDate] = useState(
    type === "quote"
      ? (initialData?.expiryDate ? new Date(initialData.expiryDate).toISOString().split("T")[0] : "")
      : type === "delivery"
      ? (initialData?.deliveryDate ? new Date(initialData.deliveryDate).toISOString().split("T")[0] : "")
      : (initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split("T")[0] : "")
  )
  const [taxRate, setTaxRate] = useState(initialData?.taxRate ?? 10)
  const [notes, setNotes] = useState(initialData?.notes ?? "")
  const [lineItems, setLineItems] = useState<LineItem[]>(
    initialData?.lineItems ?? [{ description: "", quantity: 1, unit: "式", unitPrice: 0, amount: 0, sortOrder: 0 }]
  )

  useEffect(() => {
    fetch("/api/clients").then(r => r.json()).then(setClients)
  }, [])

  // 空行を除いた品目で合計を計算（表示・送信どちらも同じ基準）
  const filledItems = lineItems.filter(i => i.description.trim() !== "")
  const { subtotal, taxAmount, total } = calcTotals(filledItems, taxRate)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!clientId) { toast.error("取引先を選択してください"); return }
    if (filledItems.length === 0) { toast.error("品目を1件以上入力してください"); return }

    setLoading(true)
    try {
      await onSubmit({
        clientId,
        title,
        issueDate,
        ...(type === "quote" ? { expiryDate: secondDate || null } : {}),
        ...(type === "delivery" ? { deliveryDate: secondDate || null } : {}),
        ...(type === "invoice" ? { dueDate: secondDate || null } : {}),
        taxRate,
        subtotal,
        taxAmount,
        total,
        notes,
        lineItems: filledItems.map((item, i) => ({ ...item, sortOrder: i })),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本情報 */}
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <h3 className="font-semibold text-slate-700">基本情報</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>取引先 *</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="取引先を選択" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>件名 *</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="○○システム開発一式" className="mt-1" />
          </div>
          <div>
            <Label>発行日</Label>
            <Input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>
              {type === "quote" ? "有効期限" : type === "delivery" ? "納品日" : "支払期限"}
            </Label>
            <Input type="date" value={secondDate} onChange={e => setSecondDate(e.target.value)} className="mt-1" />
          </div>
        </div>
      </div>

      {/* 品目明細 */}
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <h3 className="font-semibold text-slate-700">品目明細</h3>
        <LineItemsTable items={lineItems} onChange={setLineItems} />

        {/* 合計 */}
        <div className="flex justify-end">
          <div className="w-72 space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">小計</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">消費税</span>
              <div className="flex items-center gap-2">
                <Select value={String(taxRate)} onValueChange={v => setTaxRate(Number(v))}>
                  <SelectTrigger className="h-7 w-20 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="8">8%</SelectItem>
                    <SelectItem value="0">0%</SelectItem>
                  </SelectContent>
                </Select>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>合計</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 備考 */}
      <div className="bg-white rounded-xl border p-6">
        <Label>備考</Label>
        <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="振込手数料はご負担ください。" className="mt-1" rows={3} />
      </div>

      {/* ボタン */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          キャンセル
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "保存中..." : (submitLabel ?? `${typeLabel[type]}を保存`)}
        </Button>
      </div>
    </form>
  )
}
