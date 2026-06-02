import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getNextSeq } from "@/lib/document-helpers"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")

  const quotes = await prisma.quote.findMany({
    where: {
      companyId: session.user.companyId,
      ...(status ? { status: status as any } : {}),
    },
    include: { client: true, lineItems: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(quotes)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const data = await req.json()
  const { lineItems, ...quoteData } = data

  const quoteNumber = await getNextSeq(session.user.companyId, "quote")

  const quote = await prisma.quote.create({
    data: {
      ...quoteData,
      quoteNumber,
      companyId: session.user.companyId,
      createdById: session.user.id,
      issueDate: new Date(quoteData.issueDate),
      expiryDate: quoteData.expiryDate ? new Date(quoteData.expiryDate) : null,
      lineItems: {
        create: lineItems.map((item: any, i: number) => ({
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
          sortOrder: i,
          amount: Math.round(item.quantity * item.unitPrice),
        })),
      },
    },
    include: { client: true, lineItems: { orderBy: { sortOrder: "asc" } } },
  })
  return NextResponse.json(quote)
}
