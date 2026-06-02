"use client"

import { useRouter } from "next/navigation"
import { DocumentForm } from "@/components/documents/DocumentForm"
import { toast } from "sonner"

export default function NewQuotePage() {
  const router = useRouter()

  async function handleSubmit(data: any) {
    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const quote = await res.json()
      toast.success("見積書を作成しました")
      router.push(`/quotes/${quote.id}`)
    } else {
      toast.error("保存に失敗しました")
      throw new Error()
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">見積書 新規作成</h1>
      <DocumentForm type="quote" onSubmit={handleSubmit} />
    </div>
  )
}
