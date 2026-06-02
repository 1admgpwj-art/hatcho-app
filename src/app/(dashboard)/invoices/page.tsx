import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatCurrency, formatDate } from "@/lib/utils"
import { StatusBadge } from "@/components/documents/StatusBadge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Receipt } from "lucide-react"

export default async function InvoicesPage() {
  const session = await auth()
  if (!session) return null

  const invoices = await prisma.invoice.findMany({
    where: { companyId: session.user.companyId },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">請求書</h1>
        <Button asChild>
          <Link href="/invoices/new"><Plus className="h-4 w-4 mr-2" />新規作成</Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {invoices.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Receipt className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>請求書がありません</p>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/invoices/new">最初の請求書を作成</Link>
            </Button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">請求書番号</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">件名</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">取引先</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">金額</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">支払期限</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">入金</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">ステータス</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/invoices/${inv.id}`} className="text-blue-600 hover:underline font-medium">
                      {inv.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{inv.title}</td>
                  <td className="px-4 py-3 text-slate-500">{inv.client.name}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(inv.total)}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {inv.dueDate ? formatDate(inv.dueDate) : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {inv.isPaid ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">入金済み</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">未入金</span>
                    )}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
