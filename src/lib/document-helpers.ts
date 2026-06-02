import { prisma } from "@/lib/prisma"

export async function getNextSeq(
  companyId: string,
  type: "quote" | "delivery" | "invoice"
) {
  const year = new Date().getFullYear()
  const prefix = type === "quote" ? "QUO" : type === "delivery" ? "NAK" : "INV"
  const pattern = `${prefix}-${year}-%`

  let max = 0
  if (type === "quote") {
    const row = await prisma.quote.findFirst({
      where: { companyId, quoteNumber: { startsWith: `${prefix}-${year}-` } },
      orderBy: { quoteNumber: "desc" },
    })
    if (row) max = parseInt(row.quoteNumber.split("-")[2]) || 0
  } else if (type === "delivery") {
    const row = await prisma.delivery.findFirst({
      where: { companyId, deliveryNumber: { startsWith: `${prefix}-${year}-` } },
      orderBy: { deliveryNumber: "desc" },
    })
    if (row) max = parseInt(row.deliveryNumber.split("-")[2]) || 0
  } else {
    const row = await prisma.invoice.findFirst({
      where: { companyId, invoiceNumber: { startsWith: `${prefix}-${year}-` } },
      orderBy: { invoiceNumber: "desc" },
    })
    if (row) max = parseInt(row.invoiceNumber.split("-")[2]) || 0
  }

  return `${prefix}-${year}-${String(max + 1).padStart(4, "0")}`
}
