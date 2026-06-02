"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts"
import { formatCurrency } from "@/lib/utils"

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "#94a3b8",
  SENT: "#3b82f6",
  APPROVED: "#22c55e",
  COMPLETED: "#a855f7",
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "下書き",
  SENT: "送付済み",
  APPROVED: "承認済み",
  COMPLETED: "完了",
}

interface Props {
  monthlyData: { month: string; amount: number; count: number }[]
  statusCounts: { status: string; _count: number }[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-medium text-slate-700 mb-1">{label}</p>
        <p className="text-blue-600">{formatCurrency(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export function MonthlyRevenueChart({ data }: { data: Props["monthlyData"] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => v >= 10000 ? `${Math.round(v / 10000)}万` : `${v}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function StatusPieChart({ data }: { data: Props["statusCounts"] }) {
  const chartData = data.map((d) => ({
    name: STATUS_LABELS[d.status] ?? d.status,
    value: d._count,
    color: STATUS_COLORS[d.status] ?? "#e2e8f0",
  }))

  if (chartData.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">
        データがありません
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
        />
        <Tooltip formatter={(value) => [`${value}件`]} />
      </PieChart>
    </ResponsiveContainer>
  )
}
