"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DocumentForm } from "@/components/documents/DocumentForm"
import { toast } from "sonner"

export default function EditQuotePage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const [quote, setQuote] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/quotes/${id}`).then(r => r.json()).then(setQuote)
  }, [id])

  async function handleSubmit(data: any) {
    const res = await fetch(`/api/quotes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      toast.success("更新しました")
      router.push(`/quotes/${id}`)
    } else {
      toast.error("更新に失敗しました")
      throw new Error()
    }
  }

  if (!quote) return <div className="p-6">読み込み中...</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">見積書 編集</h1>
      <DocumentForm type="quote" initialData={quote} onSubmit={handleSubmit} submitLabel="更新する" />
    </div>
  )
}
