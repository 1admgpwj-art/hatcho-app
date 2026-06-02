"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DocumentForm } from "@/components/documents/DocumentForm"
import { toast } from "sonner"

export default function EditDeliveryPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const [delivery, setDelivery] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/deliveries/${id}`).then(r => r.json()).then(setDelivery)
  }, [id])

  async function handleSubmit(data: any) {
    const res = await fetch(`/api/deliveries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      toast.success("更新しました")
      router.push(`/deliveries/${id}`)
    } else {
      toast.error("更新に失敗しました")
      throw new Error()
    }
  }

  if (!delivery) return <div className="p-6">読み込み中...</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">納品書 編集</h1>
      <DocumentForm type="delivery" initialData={delivery} onSubmit={handleSubmit} submitLabel="更新する" />
    </div>
  )
}
