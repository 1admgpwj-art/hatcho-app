import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Users } from "lucide-react"
import type { Client } from "@prisma/client"

export default async function ClientsPage() {
  const session = await auth()
  if (!session) return null

  const clients = await prisma.client.findMany({
    where: { companyId: session.user.companyId },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">取引先</h1>
        <Button asChild>
          <Link href="/clients/new"><Plus className="h-4 w-4 mr-2" />新規追加</Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {clients.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>取引先がありません</p>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/clients/new">最初の取引先を追加</Link>
            </Button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">会社名</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">担当者</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">メール</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">電話番号</th>
                <th className="w-20" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {clients.map((c: Client) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                  <td className="px-4 py-3 text-slate-500">{c.contactPerson ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-500">{c.email ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-500">{c.phone ?? "-"}</td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/clients/${c.id}`}>編集</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
