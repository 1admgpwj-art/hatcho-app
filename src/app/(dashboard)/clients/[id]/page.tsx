"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function EditClientPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const [client, setClient] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/clients/${id}`).then(r => r.json()).then(setClient)
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const data = Object.fromEntries(form.entries())

    const res = await fetch(`/api/clients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      toast.success("更新しました")
      router.push("/clients")
    } else {
      toast.error("更新に失敗しました")
    }
  }

  async function handleDelete() {
    if (!confirm("この取引先を削除しますか？")) return
    const res = await fetch(`/api/clients/${id}`, { method: "DELETE" })
    if (res.ok) { toast.success("削除しました"); router.push("/clients") }
    else toast.error("削除に失敗しました")
  }

  if (!client) return <div className="p-6">読み込み中...</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">取引先 編集</h1>
      <div className="bg-white rounded-xl border p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>会社名・屋号 *</Label>
              <Input name="name" required defaultValue={client.name} className="mt-1" />
            </div>
            <div>
              <Label>担当者名</Label>
              <Input name="contactPerson" defaultValue={client.contactPerson ?? ""} className="mt-1" />
            </div>
            <div>
              <Label>郵便番号</Label>
              <Input name="postalCode" defaultValue={client.postalCode ?? ""} className="mt-1" />
            </div>
            <div>
              <Label>電話番号</Label>
              <Input name="phone" defaultValue={client.phone ?? ""} className="mt-1" />
            </div>
            <div className="md:col-span-2">
              <Label>住所</Label>
              <Input name="address" defaultValue={client.address ?? ""} className="mt-1" />
            </div>
            <div className="md:col-span-2">
              <Label>メールアドレス</Label>
              <Input name="email" type="email" defaultValue={client.email ?? ""} className="mt-1" />
            </div>
          </div>
          <div className="flex justify-between pt-2">
            <Button type="button" variant="outline" className="text-red-600 hover:text-red-700" onClick={handleDelete}>
              削除
            </Button>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()}>キャンセル</Button>
              <Button type="submit">更新する</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
