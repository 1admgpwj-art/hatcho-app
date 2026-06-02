import type { Metadata } from "next"
import { Noto_Sans_JP } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "帳票くん - 見積書・納品書・請求書を一気通貫で管理",
  description: "中小企業・個人事業主向けの帳票管理SaaS。見積書から請求書まで一気通貫で管理できます。",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
