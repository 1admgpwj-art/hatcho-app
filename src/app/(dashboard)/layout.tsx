import { SessionProvider } from "next-auth/react"
import { Sidebar } from "@/components/layout/Sidebar"
import { MobileNav } from "@/components/layout/MobileNav"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Receipt } from "lucide-react"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen bg-slate-50">
        {/* PCサイドバー */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          {/* モバイルヘッダー */}
          <div className="md:hidden bg-slate-900 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-white">
              <Receipt className="h-5 w-5 text-blue-400" />
              帳票くん
            </div>
            <MobileNav />
          </div>

          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SessionProvider>
  )
}
