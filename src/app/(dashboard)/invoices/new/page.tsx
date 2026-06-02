"use client"

import { useRouter } from "next/navigation"
import { DocumentForm } from "@/components/documents/DocumentForm"
import { toast } from "sonner"

export default function NewInvoicePage() {
  const router = useRouter()

  async function handleSubmit(data: any) {
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const invoice = await res.json()
      toast.success("請求書を作成しました")
      router.push(`/invoices/${invoice.id}`)
    } else {
      toast.error("保存に失敗しました")
      throw new Error()
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">請求書 新規作成</h1>
      <DocumentForm type="invoice" onSubmit={handleSubmit} />
    </div>
  )
}
