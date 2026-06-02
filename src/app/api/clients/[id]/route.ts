import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function getClient(id: string, companyId: string) {
  return prisma.client.findFirst({ where: { id, companyId } })
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const client = await getClient(id, session.user.companyId)
  if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(client)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const existing = await getClient(id, session.user.companyId)
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const data = await req.json()
  const client = await prisma.client.update({ where: { id }, data })
  return NextResponse.json(client)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const existing = await getClient(id, session.user.companyId)
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
  await prisma.client.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
