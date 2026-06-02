import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const company = await prisma.company.findUnique({
    where: { id: session.user.companyId },
  })
  return NextResponse.json(company)
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const data = await req.json()
  const company = await prisma.company.update({
    where: { id: session.user.companyId },
    data,
  })
  return NextResponse.json(company)
}
