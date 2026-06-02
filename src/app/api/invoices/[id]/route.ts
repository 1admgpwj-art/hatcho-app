import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function getInvoice(id: string, companyId: string) {
  return prisma.invoice.findFirst({
    where: { id, companyId },
    include: { client: true, lineItems: { orderBy: { sortOrder: "asc" } } },
  })
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const invoice = await getInvoice(id, session.user.companyId)
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(invoice)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const existing = await getInvoice(id, session.user.companyId)
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const data = await req.json()
  const { lineItems, ...docData } = data

  await prisma.invoiceLineItem.deleteMany({ where: { invoiceId: id } })

  const invoice = await prisma.invoice.update({
    where: { id },
    data: {
      ...docData,
      issueDate: new Date(docData.issueDate),
      dueDate: docData.dueDate ? new Date(docData.dueDate) : null,
      paidAt: docData.paidAt ? new Date(docData.paidAt) : null,
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
  return NextResponse.json(invoice)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const existing = await getInvoice(id, session.user.companyId)
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
  await prisma.invoice.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
