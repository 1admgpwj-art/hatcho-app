import type { DocumentStatus, UserRole } from "@prisma/client"

export type { DocumentStatus, UserRole }

export type LineItem = {
  id?: string
  description: string
  quantity: number
  unit: string
  unitPrice: number
  amount: number
  sortOrder: number
}

export type DocumentType = "quote" | "delivery" | "invoice"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      companyId: string
      companyName: string
      role: string
    }
  }
}
