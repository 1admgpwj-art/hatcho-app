import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getNextSeq } from "@/lib/document-helpers"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")

  const deliveries = await prisma.delivery.findMany({
    where: {
      companyId: session.user.companyId,
      ...(status ? { status: status as any } : {}),
    },
    include: { client: true, lineItems: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(deliveries)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const data = await req.json()
  const { lineItems, ...docData } = data

  const deliveryNumber = await getNextSeq(session.user.companyId, "delivery")

  const delivery = await prisma.delivery.create({
    data: {
      ...docData,
      deliveryNumber,
      companyId: session.user.companyId,
      createdById: session.user.id,
      issueDate: new Date(docData.issueDate),
      deliveryDate: docData.deliveryDate ? new Date(docData.deliveryDate) : null,
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
  return NextResponse.json(delivery)
}
