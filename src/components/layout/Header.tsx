"use client"

import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Header({ title }: { title?: string }) {
  const { data: session } = useSession()

  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-6">
      <h1 className="font-semibold text-slate-800">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">{session?.user?.companyName}</span>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
            {session?.user?.name?.charAt(0) ?? "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
