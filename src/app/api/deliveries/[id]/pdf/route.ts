import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { renderToBuffer } from "@react-pdf/renderer"
import { DeliveryPdf } from "@/components/documents/pdf/DeliveryPdf"
import React from "react"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const delivery = await prisma.delivery.findFirst({
    where: { id, companyId: session.user.companyId },
    include: { client: true, lineItems: { orderBy: { sortOrder: "asc" } } },
  })
  if (!delivery) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const company = await prisma.company.findUnique({ where: { id: session.user.companyId } })

  const buffer = await renderToBuffer(React.createElement(DeliveryPdf, { delivery, company }) as any)

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${delivery.deliveryNumber}.pdf"`,
    },
  })
}
