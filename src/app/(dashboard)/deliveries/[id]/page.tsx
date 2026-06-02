import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { formatCurrency, formatDate } from "@/lib/utils"
import { StatusBadge } from "@/components/documents/StatusBadge"
import { LineItemsTable } from "@/components/documents/LineItemsTable"
import { DeliveryActions } from "./DeliveryActions"
import { DocumentFlow } from "@/components/documents/DocumentFlow"

export default async function DeliveryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect("/login")

  const { id } = await params
  const delivery = await prisma.delivery.findFirst({
    where: { id, companyId: session.user.companyId },
    include: {
      client: true,
      lineItems: { orderBy: { sortOrder: "asc" } },
      quote: true,
      invoices: { take: 1 },
    },
  })

  if (!delivery) notFound()

  const company = await prisma.company.findUnique({ where: { id: session.user.companyId } })
  const invoice = delivery.invoices[0]

  return (
    <div className="p-6 space-y-6">
      <DocumentFlow
        current="delivery"
        quoteId={delivery.quoteId}
        quoteNumber={delivery.quote?.quoteNumber}
        deliveryId={delivery.id}
        deliveryNumber={delivery.deliveryNumber}
        invoiceId={invoice?.id}
        invoiceNumber={invoice?.invoiceNumber}
      />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">納品書</p>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800">{delivery.deliveryNumber}</h1>
            <StatusBadge status={delivery.status} />
          </div>
        </div>
        <DeliveryActions delivery={delivery} />
      </div>

      <div className="bg-white rounded-xl border p-8 max-w-3xl">
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-1">納品書</h2>
            <p className="text-slate-500 text-sm">番号: {delivery.deliveryNumber}</p>
            <p className="text-slate-500 text-sm">発行日: {formatDate(delivery.issueDate)}</p>
            {delivery.deliveryDate && (
              <p className="text-slate-500 text-sm">納品日: {formatDate(delivery.deliveryDate)}</p>
            )}
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">{company?.name}</p>
            {company?.address && <p className="text-slate-500 text-sm">{company.address}</p>}
            {company?.phone && <p className="text-slate-500 text-sm">TEL: {company.phone}</p>}
          </div>
        </div>

        <div className="mb-6 pb-6 border-b">
          <p className="text-lg font-medium">{delivery.client.name} 御中</p>
        </div>

        <h3 className="font-semibold text-lg mb-4">{delivery.title}</h3>

        <LineItemsTable
          items={delivery.lineItems.map(li => ({
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
              <span>{formatCurrency(delivery.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">消費税（{delivery.taxRate}%）</span>
              <span>{formatCurrency(delivery.taxAmount)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>合計</span>
              <span>{formatCurrency(delivery.total)}</span>
            </div>
          </div>
        </div>

        {delivery.notes && (
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm font-medium text-slate-600 mb-1">備考</p>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{delivery.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
