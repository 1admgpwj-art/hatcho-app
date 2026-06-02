"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Mail, Send } from "lucide-react"
import { toast } from "sonner"

interface Props {
  type: "quote" | "delivery" | "invoice"
  documentId: string
  documentTitle: string
  clientEmail?: string | null
}

const typeLabel = { quote: "御見積書", delivery: "納品書", invoice: "請求書" }

export function SendEmailDialog({ type, documentId, documentTitle, clientEmail }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [to, setTo] = useState(clientEmail ?? "")
  const [subject, setSubject] = useState(`【${typeLabel[type]}】${documentTitle}`)
  const [message, setMessage] = useState(
    `いつもお世話になっております。\n\n${typeLabel[type]}をお送りいたします。\n添付のPDFをご確認いただきますよう、よろしくお願いいたします。`
  )

  async function handleSend() {
    if (!to) { toast.error("送信先メールアドレスを入力してください"); return }
    setLoading(true)
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, documentId, to, subject, message }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`${typeLabel[type]}を送信しました`)
        setOpen(false)
      } else {
        toast.error(data.error ?? "送信に失敗しました")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Mail className="h-4 w-4 mr-2" />メールで送る
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            {typeLabel[type]}をメールで送信
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <p className="text-sm text-slate-500">PDFが自動生成されてメールに添付されます。</p>
          <div>
            <Label>送信先メールアドレス *</Label>
            <Input value={to} onChange={e => setTo(e.target.value)} type="email" placeholder="client@example.com" className="mt-1" />
          </div>
          <div>
            <Label>件名</Label>
            <Input value={subject} onChange={e => setSubject(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>本文</Label>
            <Textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} className="mt-1" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>キャンセル</Button>
            <Button onClick={handleSend} disabled={loading}>
              <Send className="h-4 w-4 mr-2" />
              {loading ? "送信中..." : "送信する"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
