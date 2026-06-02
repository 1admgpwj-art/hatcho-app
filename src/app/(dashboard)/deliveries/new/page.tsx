"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { DocumentForm } from "@/components/documents/DocumentForm"
import { toast } from "sonner"

function NewDeliveryForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const quoteId = searchParams.get("fromQuote")
  const [initialData, setInitialData] = useState<any>(null)

  useEffect(() => {
    if (quoteId) {
      fetch(`/api/quotes/${quoteId}`).then(r => r.json()).then(data => {
        setInitialData({ ...data, quoteId })
      })
    } else {
      setInitialData({})
    }
  }, [quoteId])

  async function handleSubmit(data: any) {
    const res = await fetch("/api/deliveries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, quoteId: quoteId || null }),
    })
    if (res.ok) {
      const delivery = await res.json()
      toast.success("納品書を作成しました")
      router.push(`/deliveries/${delivery.id}`)
    } else {
      toast.error("保存に失敗しました")
      throw new Error()
    }
  }

  if (!initialData) return <div className="p-6">読み込み中...</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">納品書 新規作成</h1>
      <DocumentForm type="delivery" initialData={initialData} onSubmit={handleSubmit} />
    </div>
  )
}

export default function NewDeliveryPage() {
  return (
    <Suspense fallback={<div className="p-6">読み込み中...</div>}>
      <NewDeliveryForm />
    </Suspense>
  )
}
