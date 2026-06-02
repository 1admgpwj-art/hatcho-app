"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Receipt } from "lucide-react"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: form.get("companyName"),
        userName: form.get("userName"),
        email: form.get("email"),
        password: form.get("password"),
      }),
    })

    setLoading(false)
    if (res.ok) {
      toast.success("登録が完了しました。ログインしてください。")
      router.push("/login")
    } else {
      const data = await res.json()
      toast.error(data.error || "登録に失敗しました")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 font-bold text-2xl mb-2">
            <Receipt className="h-7 w-7 text-blue-600" />
            帳票くん
          </div>
          <p className="text-slate-500">無料アカウントを作成</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="companyName">会社名・屋号</Label>
              <Input id="companyName" name="companyName" required className="mt-1" placeholder="株式会社〇〇 / 山田太郎" />
            </div>
            <div>
              <Label htmlFor="userName">お名前</Label>
              <Input id="userName" name="userName" required className="mt-1" placeholder="山田 太郎" />
            </div>
            <div>
              <Label htmlFor="email">メールアドレス</Label>
              <Input id="email" name="email" type="email" required className="mt-1" placeholder="your@email.com" />
            </div>
            <div>
              <Label htmlFor="password">パスワード（8文字以上）</Label>
              <Input id="password" name="password" type="password" required minLength={8} className="mt-1" placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "登録中..." : "無料で登録"}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            すでにアカウントをお持ちの方は{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
