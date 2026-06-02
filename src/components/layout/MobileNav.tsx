"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Menu, X, Receipt, LayoutDashboard, FileText, Package, Users, Settings, LogOut } from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/quotes", label: "見積書", icon: FileText },
  { href: "/deliveries", label: "納品書", icon: Package },
  { href: "/invoices", label: "請求書", icon: Receipt },
  { href: "/clients", label: "取引先", icon: Users },
  { href: "/settings", label: "設定", icon: Settings },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-white/10 transition-colors md:hidden">
        <Menu className="h-5 w-5 text-white" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* オーバーレイ */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          {/* ドロワー */}
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-slate-900 flex flex-col">
            <div className="px-4 py-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-lg text-white">
                <Receipt className="h-5 w-5 text-blue-400" />
                帳票くん
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/10">
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            <nav className="flex-1 py-4 px-2 space-y-1">
              {navItems.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                      active ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white hover:bg-white/10"
                    )}>
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="p-4 border-t border-white/10">
              <button onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-colors w-full">
                <LogOut className="h-4 w-4" />ログアウト
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
