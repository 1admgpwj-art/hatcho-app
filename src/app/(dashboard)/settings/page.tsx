"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function SettingsPage() {
  const [company, setCompany] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(setCompany)
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const data = Object.fromEntries(form.entries())

    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    setLoading(false)
    if (res.ok) toast.success("設定を保存しました")
    else toast.error("保存に失敗しました")
  }

  if (!company) return <div className="p-6">読み込み中...</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">設定</h1>

      <div className="bg-white rounded-xl border p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="font-semibold text-slate-700 mb-4">自社情報</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>会社名・屋号 *</Label>
              <Input name="name" required defaultValue={company.name} className="mt-1" />
            </div>
            <div>
              <Label>郵便番号</Label>
              <Input name="postalCode" defaultValue={company.postalCode ?? ""} className="mt-1" />
            </div>
            <div className="md:col-span-2">
              <Label>住所</Label>
              <Input name="address" defaultValue={company.address ?? ""} className="mt-1" />
            </div>
            <div>
              <Label>電話番号</Label>
              <Input name="phone" defaultValue={company.phone ?? ""} className="mt-1" />
            </div>
            <div>
              <Label>FAX</Label>
              <Input name="fax" defaultValue={company.fax ?? ""} className="mt-1" />
            </div>
            <div className="md:col-span-2">
              <Label>メールアドレス</Label>
              <Input name="email" type="email" defaultValue={company.email ?? ""} className="mt-1" />
            </div>
            <div className="md:col-span-2">
              <Label>インボイス登録番号</Label>
              <Input name="invoiceRegistrationNumber" defaultValue={company.invoiceRegistrationNumber ?? ""} placeholder="T1234567890123" className="mt-1" />
            </div>
          </div>

          <div className="pt-4 border-t">
            <h2 className="font-semibold text-slate-700 mb-4">振込先口座情報</h2>
            <div>
              <Label>振込先（請求書に印刷されます）</Label>
              <Textarea
                name="bankInfo"
                defaultValue={company.bankInfo ?? ""}
                placeholder="〇〇銀行 △△支店&#10;普通 1234567&#10;名義: 株式会社〇〇"
                className="mt-1"
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "保存中..." : "保存する"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
