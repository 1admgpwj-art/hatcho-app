"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { LineItem } from "@/types"

interface Props {
  items: LineItem[]
  onChange?: (items: LineItem[]) => void
  readOnly?: boolean
}

export function LineItemsTable({ items, onChange, readOnly = false }: Props) {
  function addItem() {
    onChange?.([
      ...items,
      { description: "", quantity: 1, unit: "式", unitPrice: 0, amount: 0, sortOrder: items.length },
    ])
  }

  function removeItem(index: number) {
    onChange?.(items.filter((_, i) => i !== index))
  }

  function updateItem(index: number, field: keyof LineItem, value: string | number) {
    const updated = items.map((item, i) => {
      if (i !== index) return item
      const newItem = { ...item, [field]: value }
      newItem.amount = Math.round(Number(newItem.quantity) * Number(newItem.unitPrice))
      return newItem
    })
    onChange?.(updated)
  }

  const subtotal = items.reduce((s, item) => s + item.amount, 0)

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-slate-600">
              <th className="text-left px-3 py-2 font-medium w-full">品目</th>
              <th className="text-right px-3 py-2 font-medium whitespace-nowrap">数量</th>
              <th className="text-left px-3 py-2 font-medium">単位</th>
              <th className="text-right px-3 py-2 font-medium whitespace-nowrap">単価</th>
              <th className="text-right px-3 py-2 font-medium whitespace-nowrap">金額</th>
              {!readOnly && <th className="w-10" />}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b last:border-b-0">
                <td className="px-3 py-2">
                  {readOnly ? (
                    <span>{item.description}</span>
                  ) : (
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(i, "description", e.target.value)}
                      placeholder="品目名を入力"
                      className="border-0 shadow-none p-0 h-8 focus-visible:ring-0"
                    />
                  )}
                </td>
                <td className="px-3 py-2 text-right">
                  {readOnly ? (
                    <span>{item.quantity}</span>
                  ) : (
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(i, "quantity", parseFloat(e.target.value) || 0)}
                      className="border-0 shadow-none p-0 h-8 text-right w-20 focus-visible:ring-0"
                    />
                  )}
                </td>
                <td className="px-3 py-2">
                  {readOnly ? (
                    <span>{item.unit}</span>
                  ) : (
                    <Input
                      value={item.unit}
                      onChange={(e) => updateItem(i, "unit", e.target.value)}
                      className="border-0 shadow-none p-0 h-8 w-12 focus-visible:ring-0"
                    />
                  )}
                </td>
                <td className="px-3 py-2 text-right">
                  {readOnly ? (
                    <span>{formatCurrency(item.unitPrice)}</span>
                  ) : (
                    <Input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(i, "unitPrice", parseInt(e.target.value) || 0)}
                      className="border-0 shadow-none p-0 h-8 text-right w-28 focus-visible:ring-0"
                    />
                  )}
                </td>
                <td className="px-3 py-2 text-right font-medium">{formatCurrency(item.amount)}</td>
                {!readOnly && (
                  <td className="px-1 py-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-400 hover:text-red-500"
                      onClick={() => removeItem(i)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!readOnly && (
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="w-full border-dashed">
          <Plus className="h-4 w-4 mr-2" />
          品目を追加
        </Button>
      )}
    </div>
  )
}
