"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function NewClientPage() {
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const data = Object.fromEntries(form.entries())

    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      toast.success("取引先を追加しました")
      router.push("/clients")
    } else {
      toast.error("保存に失敗しました")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">取引先 新規追加</h1>
      <div className="bg-white rounded-xl border p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>会社名・屋号 *</Label>
              <Input name="name" required placeholder="株式会社〇〇" className="mt-1" />
            </div>
            <div>
              <Label>担当者名</Label>
              <Input name="contactPerson" placeholder="山田 太郎" className="mt-1" />
            </div>
            <div>
              <Label>郵便番号</Label>
              <Input name="postalCode" placeholder="100-0001" className="mt-1" />
            </div>
            <div>
              <Label>電話番号</Label>
              <Input name="phone" placeholder="03-0000-0000" className="mt-1" />
            </div>
            <div className="md:col-span-2">
              <Label>住所</Label>
              <Input name="address" placeholder="東京都千代田区〇〇1-1-1" className="mt-1" />
            </div>
            <div className="md:col-span-2">
              <Label>メールアドレス</Label>
              <Input name="email" type="email" placeholder="contact@example.com" className="mt-1" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>キャンセル</Button>
            <Button type="submit">追加する</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
