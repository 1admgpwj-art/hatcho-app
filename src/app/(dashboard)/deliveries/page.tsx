import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatCurrency, formatDate } from "@/lib/utils"
import { StatusBadge } from "@/components/documents/StatusBadge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Package } from "lucide-react"

export default async function DeliveriesPage() {
  const session = await auth()
  if (!session) return null

  const deliveries = await prisma.delivery.findMany({
    where: { companyId: session.user.companyId },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">納品書</h1>
        <Button asChild>
          <Link href="/deliveries/new"><Plus className="h-4 w-4 mr-2" />新規作成</Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {deliveries.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Package className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>納品書がありません</p>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/deliveries/new">最初の納品書を作成</Link>
            </Button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">納品書番号</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">件名</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">取引先</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">金額</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">発行日</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">ステータス</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {deliveries.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/deliveries/${d.id}`} className="text-blue-600 hover:underline font-medium">
                      {d.deliveryNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{d.title}</td>
                  <td className="px-4 py-3 text-slate-500">{d.client.name}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(d.total)}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(d.issueDate)}</td>
                  <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
