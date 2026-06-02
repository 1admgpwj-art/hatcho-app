import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { formatCurrency, formatDate } from "@/lib/utils"
import { StatusBadge } from "@/components/documents/StatusBadge"
import { LineItemsTable } from "@/components/documents/LineItemsTable"
import { InvoiceActions } from "./InvoiceActions"
import { DocumentFlow } from "@/components/documents/DocumentFlow"

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect("/login")

  const { id } = await params
  const invoice = await prisma.invoice.findFirst({
    where: { id, companyId: session.user.companyId },
    include: {
      client: true,
      lineItems: { orderBy: { sortOrder: "asc" } },
      delivery: { include: { quote: true } },
    },
  })

  if (!invoice) notFound()

  const company = await prisma.company.findUnique({ where: { id: session.user.companyId } })

  return (
    <div className="p-6 space-y-6">
      <DocumentFlow
        current="invoice"
        quoteId={invoice.delivery?.quoteId}
        quoteNumber={invoice.delivery?.quote?.quoteNumber}
        deliveryId={invoice.deliveryId}
        deliveryNumber={invoice.delivery?.deliveryNumber}
        invoiceId={invoice.id}
        invoiceNumber={invoice.invoiceNumber}
      />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">請求書</p>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800">{invoice.invoiceNumber}</h1>
            <StatusBadge status={invoice.status} />
            {invoice.isPaid ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">入金済み</span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">未入金</span>
            )}
          </div>
        </div>
        <InvoiceActions invoice={invoice} />
      </div>

      <div className="bg-white rounded-xl border p-8 max-w-3xl">
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-1">請求書</h2>
            <p className="text-slate-500 text-sm">番号: {invoice.invoiceNumber}</p>
            <p className="text-slate-500 text-sm">発行日: {formatDate(invoice.issueDate)}</p>
            {invoice.dueDate && (
              <p className="text-slate-500 text-sm">支払期限: {formatDate(invoice.dueDate)}</p>
            )}
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">{company?.name}</p>
            {company?.address && <p className="text-slate-500 text-sm">{company.address}</p>}
            {company?.phone && <p className="text-slate-500 text-sm">TEL: {company.phone}</p>}
            {company?.email && <p className="text-slate-500 text-sm">{company.email}</p>}
            {company?.invoiceRegistrationNumber && (
              <p className="text-slate-500 text-xs mt-1">登録番号: {company.invoiceRegistrationNumber}</p>
            )}
          </div>
        </div>

        <div className="mb-6 pb-6 border-b">
          <p className="text-lg font-medium">{invoice.client.name} 御中</p>
          {invoice.client.contactPerson && <p className="text-slate-500 text-sm">{invoice.client.contactPerson} 様</p>}
        </div>

        <h3 className="font-semibold text-lg mb-4">{invoice.title}</h3>

        <LineItemsTable
          items={invoice.lineItems.map(li => ({
            id: li.id,
            description: li.description,
            quantity: li.quantity,
            unit: li.unit,
            unitPrice: li.unitPrice,
            amount: li.amount,
            sortOrder: li.sortOrder,
          }))}
          readOnly
        />

        <div className="flex justify-end mt-6">
          <div className="w-64 space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">小計</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">消費税（{invoice.taxRate}%）</span>
              <span>{formatCurrency(invoice.taxAmount)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>合計</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {company?.bankInfo && (
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm font-medium text-slate-600 mb-1">お振込先</p>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{company.bankInfo}</p>
          </div>
        )}

        {invoice.notes && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium text-slate-600 mb-1">備考</p>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
