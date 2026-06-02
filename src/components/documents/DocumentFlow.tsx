import { FileText, Package, Receipt, ChevronRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Step {
  type: "quote" | "delivery" | "invoice"
  label: string
  number?: string
  id?: string
  active: boolean
  done: boolean
}

interface Props {
  quoteId?: string | null
  quoteNumber?: string | null
  deliveryId?: string | null
  deliveryNumber?: string | null
  invoiceId?: string | null
  invoiceNumber?: string | null
  current: "quote" | "delivery" | "invoice"
}

const icons = { quote: FileText, delivery: Package, invoice: Receipt }
const hrefs = { quote: "/quotes", delivery: "/deliveries", invoice: "/invoices" }

export function DocumentFlow({ quoteId, quoteNumber, deliveryId, deliveryNumber, invoiceId, invoiceNumber, current }: Props) {
  const steps: Step[] = [
    {
      type: "quote",
      label: "見積書",
      number: quoteNumber ?? undefined,
      id: quoteId ?? undefined,
      done: !!quoteId,
      active: current === "quote",
    },
    {
      type: "delivery",
      label: "納品書",
      number: deliveryNumber ?? undefined,
      id: deliveryId ?? undefined,
      done: !!deliveryId,
      active: current === "delivery",
    },
    {
      type: "invoice",
      label: "請求書",
      number: invoiceNumber ?? undefined,
      id: invoiceId ?? undefined,
      done: !!invoiceId,
      active: current === "invoice",
    },
  ]

  return (
    <div className="bg-white border rounded-xl px-6 py-4 flex items-center gap-2 flex-wrap">
      <p className="text-xs text-slate-400 font-medium mr-2 whitespace-nowrap">帳票フロー</p>
      {steps.map((step, i) => {
        const Icon = icons[step.type]
        const href = step.id ? `${hrefs[step.type]}/${step.id}` : null
        const content = (
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
            step.active && "bg-blue-50 text-blue-700 font-medium",
            step.done && !step.active && "text-slate-600 hover:bg-slate-50",
            !step.done && !step.active && "text-slate-300"
          )}>
            {step.done && !step.active ? (
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            ) : (
              <Icon className={cn("h-4 w-4 flex-shrink-0", step.active ? "text-blue-600" : "text-slate-300")} />
            )}
            <span className="whitespace-nowrap">
              {step.label}
              {step.number && <span className="ml-1 text-xs opacity-70">{step.number}</span>}
            </span>
          </div>
        )

        return (
          <div key={step.type} className="flex items-center gap-2">
            {i > 0 && (
              <ChevronRight className={cn("h-4 w-4 flex-shrink-0", steps[i - 1].done ? "text-slate-400" : "text-slate-200")} />
            )}
            {href && !step.active ? (
              <Link href={href}>{content}</Link>
            ) : (
              content
            )}
          </div>
        )
      })}
    </div>
  )
}
