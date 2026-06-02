import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function getQuote(id: string, companyId: string) {
  return prisma.quote.findFirst({
    where: { id, companyId },
    include: { client: true, lineItems: { orderBy: { sortOrder: "asc" } } },
  })
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const quote = await getQuote(id, session.user.companyId)
  if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(quote)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const existing = await getQuote(id, session.user.companyId)
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const data = await req.json()
  const { lineItems, ...quoteData } = data

  await prisma.quoteLineItem.deleteMany({ where: { quoteId: id } })

  const quote = await prisma.quote.update({
    where: { id },
    data: {
      ...quoteData,
      issueDate: new Date(quoteData.issueDate),
      expiryDate: quoteData.expiryDate ? new Date(quoteData.expiryDate) : null,
      lineItems: {
        create: lineItems.map((item: any, i: number) => ({
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
          amount: Math.round(item.quantity * item.unitPrice),
          sortOrder: i,
        })),
      },
    },
    include: { client: true, lineItems: { orderBy: { sortOrder: "asc" } } },
  })
  return NextResponse.json(quote)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const existing = await getQuote(id, session.user.companyId)
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
  await prisma.quote.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
