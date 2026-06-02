"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Package,
  Receipt,
  Users,
  Settings,
  LogOut,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/quotes", label: "見積書", icon: FileText },
  { href: "/deliveries", label: "納品書", icon: Package },
  { href: "/invoices", label: "請求書", icon: Receipt },
  { href: "/clients", label: "取引先", icon: Users },
  { href: "/settings", label: "設定", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Receipt className="h-5 w-5 text-blue-400" />
          帳票くん
        </div>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/10"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          ログアウト
        </button>
      </div>
    </aside>
  )
}
