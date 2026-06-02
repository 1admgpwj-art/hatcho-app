import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Package, Receipt, CheckCircle, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* ヘッダー */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Receipt className="h-6 w-6 text-blue-400" />
            帳票くん
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10" asChild>
              <Link href="/login">ログイン</Link>
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-400" asChild>
              <Link href="/register">無料で始める</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ヒーロー */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-1.5 text-sm text-blue-300 mb-8">
          <CheckCircle className="h-4 w-4" />
          インボイス制度対応
        </div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          見積書から請求書まで<br />
          <span className="text-blue-400">一気通貫</span>で管理
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
          中小企業・個人事業主向けの帳票管理ツール。
          見積書を作ればワンクリックで納品書・請求書に変換。
          PDFで即出力できます。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-blue-500 hover:bg-blue-400 text-lg px-8 py-6" asChild>
            <Link href="/register">
              無料で始める <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6" asChild>
            <Link href="/login">ログイン</Link>
          </Button>
        </div>
      </section>

      {/* 3ステップ */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-16">帳票業務の流れをそのままデジタル化</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: FileText,
              step: "01",
              title: "見積書を作成",
              desc: "取引先・品目・単価を入力するだけ。消費税は自動計算されます。",
              color: "text-blue-400",
              bg: "bg-blue-500/10 border-blue-500/20",
            },
            {
              icon: Package,
              step: "02",
              title: "納品書に変換",
              desc: "見積書からワンクリックで納品書を生成。入力し直す手間がありません。",
              color: "text-green-400",
              bg: "bg-green-500/10 border-green-500/20",
            },
            {
              icon: Receipt,
              step: "03",
              title: "請求書でPDF出力",
              desc: "納品書から請求書を作成し、A4 PDFで即座に出力。メール添付も簡単。",
              color: "text-purple-400",
              bg: "bg-purple-500/10 border-purple-500/20",
            },
          ].map((item) => (
            <div key={item.step} className={`border rounded-2xl p-8 ${item.bg}`}>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-bold text-white/20">{item.step}</span>
                <item.icon className={`h-8 w-8 ${item.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 機能一覧 */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-center mb-12">主な機能</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "見積書・納品書・請求書の作成・管理",
              "PDF出力（A4・日本語対応）",
              "取引先マスター管理",
              "ステータス管理（下書き→送付→承認→完了）",
              "ダッシュボード（今月の請求額・未入金一覧）",
              "インボイス登録番号の記載対応",
              "複数ユーザーでの共同利用",
              "スマートフォン対応",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-slate-200">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-6 py-24">
        <h2 className="text-3xl font-bold mb-6">今すぐ無料で始める</h2>
        <p className="text-slate-300 mb-8">クレジットカード不要。登録は1分で完了します。</p>
        <Button size="lg" className="bg-blue-500 hover:bg-blue-400 text-lg px-10 py-6" asChild>
          <Link href="/register">
            アカウントを作成 <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-slate-400 text-sm">
        © 2024 帳票くん. All rights reserved.
      </footer>
    </div>
  )
}
