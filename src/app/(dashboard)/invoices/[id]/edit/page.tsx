"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DocumentForm } from "@/components/documents/DocumentForm"
import { toast } from "sonner"

export default function EditInvoicePage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const [invoice, setInvoice] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/invoices/${id}`).then(r => r.json()).then(setInvoice)
  }, [id])

  async function handleSubmit(data: any) {
    const res = await fetch(`/api/invoices/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      toast.success("更新しました")
      router.push(`/invoices/${id}`)
    } else {
      toast.error("更新に失敗しました")
      throw new Error()
    }
  }

  if (!invoice) return <div className="p-6">読み込み中...</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">請求書 編集</h1>
      <DocumentForm type="invoice" initialData={invoice} onSubmit={handleSubmit} submitLabel="更新する" />
    </div>
  )
}
