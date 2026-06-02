"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { formatCurrency, formatDate } from "@/lib/utils"
import { MonthlyRevenueChart, StatusPieChart } from "./DashboardCharts"
import { Receipt, FileText, Package, AlertCircle, TrendingUp, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardClient() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch("/api/dashboard").then(r => r.json()).then(setData)
  }, [])

  const now = new Date()

  if (!data) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-slate-200 rounded-xl" />)}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-64 bg-slate-200 rounded-xl" />
          <div className="h-64 bg-slate-200 rounded-xl" />
        </div>
      </div>
    )
  }

  const { summary, monthlyData, statusCounts, unpaidInvoices } = data

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">ダッシュボード</h1>
        <div className="flex gap-2">
          <Button size="sm" asChild>
            <Link href="/quotes/new"><Plus className="h-4 w-4 mr-1" />見積書を作成</Link>
          </Button>
        </div>
      </div>

      {/* KPIカード */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "今月の請求総額",
            value: formatCurrency(summary.monthlyRevenue),
            icon: TrendingUp,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100",
          },
          {
            label: "未入金総額",
            value: formatCurrency(summary.unpaidTotal),
            icon: AlertCircle,
            color: "text-red-500",
            bg: "bg-red-50",
            border: "border-red-100",
          },
          {
            label: "未入金件数",
            value: `${summary.unpaidCount}件`,
            icon: Receipt,
            color: "text-orange-500",
            bg: "bg-orange-50",
            border: "border-orange-100",
          },
          {
            label: "今月の見積件数",
            value: `${summary.monthlyQuotes}件`,
            icon: FileText,
            color: "text-green-600",
            bg: "bg-green-50",
            border: "border-green-100",
          },
        ].map((card) => (
          <div key={card.label} className={`bg-white rounded-xl border ${card.border} p-5 hover:shadow-sm transition-shadow`}>
            <div className={`inline-flex p-2 rounded-lg ${card.bg} mb-3`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <p className="text-xs text-slate-500 mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-slate-800">{card.value}</p>
          </div>
        ))}
      </div>

      {/* グラフ */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <h2 className="font-semibold text-slate-700">過去6ヶ月の請求額</h2>
          </div>
          <MonthlyRevenueChart data={monthlyData} />
        </div>

        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-4 w-4 text-purple-500" />
            <h2 className="font-semibold text-slate-700">見積書のステータス内訳</h2>
          </div>
          <StatusPieChart data={statusCounts} />
        </div>
      </div>

      {/* 未入金一覧 */}
      <div className="bg-white rounded-xl border">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <h2 className="font-semibold text-slate-700">未入金の請求書</h2>
            {summary.unpaidCount > 0 && (
              <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {summary.unpaidCount}件
              </span>
            )}
          </div>
          <Link href="/invoices" className="text-sm text-blue-600 hover:underline">すべて見る</Link>
        </div>
        {unpaidInvoices.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Receipt className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">未入金の請求書はありません</p>
          </div>
        ) : (
          <div className="divide-y">
            {unpaidInvoices.map((inv: any) => {
              const overdue = inv.dueDate && new Date(inv.dueDate) < now
              return (
                <Link key={inv.id} href={`/invoices/${inv.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    {overdue && (
                      <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                        {inv.invoiceNumber}
                      </p>
                      <p className="text-sm text-slate-500">{inv.client.name} · {inv.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">{formatCurrency(inv.total)}</p>
                    {inv.dueDate && (
                      <p className={`text-xs ${overdue ? "text-red-500 font-medium" : "text-slate-400"}`}>
                        {overdue ? "⚠ 期限超過 " : "期限: "}{formatDate(inv.dueDate)}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* クイックアクション */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { href: "/quotes/new", label: "見積書を作成", sub: "取引先・品目を入力", icon: FileText, color: "from-blue-500 to-blue-600" },
          { href: "/deliveries/new", label: "納品書を作成", sub: "見積書から変換も可能", icon: Package, color: "from-green-500 to-green-600" },
          { href: "/invoices/new", label: "請求書を作成", sub: "振込先も自動印字", icon: Receipt, color: "from-purple-500 to-purple-600" },
        ].map((action) => (
          <Link key={action.href} href={action.href}
            className={`bg-gradient-to-br ${action.color} text-white rounded-xl p-5 flex items-center gap-4 hover:opacity-90 transition-opacity shadow-sm`}>
            <div className="bg-white/20 p-2.5 rounded-lg">
              <action.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">{action.label}</p>
              <p className="text-xs text-white/70 mt-0.5">{action.sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
