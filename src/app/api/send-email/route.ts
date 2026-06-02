import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"
import { renderToBuffer } from "@react-pdf/renderer"
import { QuotePdf } from "@/components/documents/pdf/QuotePdf"
import { DeliveryPdf } from "@/components/documents/pdf/DeliveryPdf"
import { InvoicePdf } from "@/components/documents/pdf/InvoicePdf"
import React from "react"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "メール送信が設定されていません（RESEND_API_KEYが未設定）" }, { status: 503 })
  }

  const body = await req.json()
  const { type, documentId, to, subject, message } = body

  // 入力値バリデーション
  const ALLOWED_TYPES = ["quote", "delivery", "invoice"] as const
  type AllowedType = typeof ALLOWED_TYPES[number]
  if (!ALLOWED_TYPES.includes(type)) {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 })
  }
  if (!documentId || typeof documentId !== "string") {
    return NextResponse.json({ error: "帳票IDが不正です" }, { status: 400 })
  }
  if (!to || typeof to !== "string" || !to.includes("@")) {
    return NextResponse.json({ error: "送信先メールアドレスが不正です" }, { status: 400 })
  }

  const companyId = session.user.companyId
  const company = await prisma.company.findUnique({ where: { id: companyId } })

  let doc: any = null
  let filename: string
  let PdfComponent: any

  if (type === "quote") {
    doc = await prisma.quote.findFirst({
      where: { id: documentId, companyId },
      include: { client: true, lineItems: { orderBy: { sortOrder: "asc" } } },
    })
    PdfComponent = QuotePdf
    filename = `${doc?.quoteNumber}.pdf`
  } else if (type === "delivery") {
    doc = await prisma.delivery.findFirst({
      where: { id: documentId, companyId },
      include: { client: true, lineItems: { orderBy: { sortOrder: "asc" } } },
    })
    PdfComponent = DeliveryPdf
    filename = `${doc?.deliveryNumber}.pdf`
  } else {
    doc = await prisma.invoice.findFirst({
      where: { id: documentId, companyId },
      include: { client: true, lineItems: { orderBy: { sortOrder: "asc" } } },
    })
    PdfComponent = InvoicePdf
    filename = `${doc?.invoiceNumber}.pdf`
  }

  if (!doc) return NextResponse.json({ error: "帳票が見つかりません" }, { status: 404 })

  const propKey = type === "quote" ? "quote" : type === "delivery" ? "delivery" : "invoice"
  const pdfBuffer = await renderToBuffer(
    React.createElement(PdfComponent, { [propKey]: doc, company }) as any
  )

  const resend = new Resend(process.env.RESEND_API_KEY)

  const typeLabel = type === "quote" ? "御見積書" : type === "delivery" ? "納品書" : "請求書"
  const fromName = company?.name ?? "帳票くん"

  const { error } = await resend.emails.send({
    from: `${fromName} <onboarding@resend.dev>`,
    to: [to],
    subject: subject || `【${typeLabel}】${doc.title}`,
    text: message || `${typeLabel}をお送りいたします。\n添付のPDFをご確認ください。\n\n${fromName}`,
    attachments: [
      {
        filename,
        content: pdfBuffer.toString("base64"),
      },
    ],
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
