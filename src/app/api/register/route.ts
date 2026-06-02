import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const schema = z.object({
  companyName: z.string().min(1),
  userName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      return NextResponse.json({ error: "このメールアドレスはすでに使用されています" }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(data.password, 10)

    await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: { name: data.companyName },
      })
      await tx.user.create({
        data: {
          companyId: company.id,
          name: data.userName,
          email: data.email,
          passwordHash,
          role: "OWNER",
        },
      })
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "登録に失敗しました" }, { status: 500 })
  }
}
