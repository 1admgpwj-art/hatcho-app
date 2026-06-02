import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  }).format(amount)
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return ""
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date))
}

export function generateDocumentNumber(
  prefix: string,
  year: number,
  seq: number
): string {
  return `${prefix}-${year}-${String(seq).padStart(4, "0")}`
}

export function calcTotals(
  lineItems: { quantity: number; unitPrice: number }[],
  taxRate: number
) {
  const subtotal = lineItems.reduce(
    (sum, item) => sum + Math.round(item.quantity * item.unitPrice),
    0
  )
  const taxAmount = Math.round(subtotal * (taxRate / 100))
  const total = subtotal + taxAmount
  return { subtotal, taxAmount, total }
}
