import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const companyId = session.user.companyId
  const now = new Date()

  // 過去6ヶ月分の月次売上
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return {
      label: `${d.getMonth() + 1}月`,
      start: new Date(d.getFullYear(), d.getMonth(), 1),
      end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59),
    }
  })

  const monthlyData = await Promise.all(
    months.map(async (m) => {
      const result = await prisma.invoice.aggregate({
        where: { companyId, issueDate: { gte: m.start, lte: m.end } },
        _sum: { total: true },
        _count: true,
      })
      return {
        month: m.label,
        amount: result._sum.total ?? 0,
        count: result._count,
      }
    })
  )

  // ステータス別件数（見積書）
  const statusCounts = await prisma.quote.groupBy({
    by: ["status"],
    where: { companyId },
    _count: true,
  })

  // 今月のサマリー
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const [monthlyInvoice, unpaidInvoices, monthlyQuotes] = await Promise.all([
    prisma.invoice.aggregate({
      where: { companyId, issueDate: { gte: startOfMonth } },
      _sum: { total: true },
    }),
    prisma.invoice.findMany({
      where: { companyId, isPaid: false },
      include: { client: true },
      orderBy: { dueDate: "asc" },
      take: 10,
    }),
    prisma.quote.count({ where: { companyId, createdAt: { gte: startOfMonth } } }),
  ])

  const unpaidTotal = unpaidInvoices.reduce((s, inv) => s + inv.total, 0)

  return NextResponse.json({
    monthlyData,
    statusCounts,
    summary: {
      monthlyRevenue: monthlyInvoice._sum.total ?? 0,
      unpaidTotal,
      unpaidCount: unpaidInvoices.length,
      monthlyQuotes,
    },
    unpaidInvoices,
  })
}
