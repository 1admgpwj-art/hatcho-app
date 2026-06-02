import React from "react"
import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer"
import path from "path"

Font.register({
  family: "NotoSansJP",
  src: path.join(process.cwd(), "public/fonts/NotoSansJP.ttf"),
})

const S = StyleSheet.create({
  page: { fontFamily: "NotoSansJP", fontSize: 9.5, padding: "30 36", color: "#1a1a1a", backgroundColor: "#fff" },
  titleBar: { backgroundColor: "#4c1d95", padding: "10 14", marginBottom: 18, borderRadius: 4 },
  titleText: { color: "#fff", fontSize: 18, fontWeight: "bold", letterSpacing: 2 },
  titleSub: { color: "#c4b5fd", fontSize: 8, marginTop: 2 },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  headerLeft: { flex: 1 },
  headerRight: { width: 180, backgroundColor: "#f8fafc", border: "1 solid #e2e8f0", borderRadius: 4, padding: 10 },
  companyName: { fontSize: 11, fontWeight: "bold", color: "#1e293b", marginBottom: 3 },
  metaRow: { flexDirection: "row", marginBottom: 2 },
  metaLabel: { color: "#94a3b8", fontSize: 8, width: 55 },
  metaValue: { color: "#475569", fontSize: 8, flex: 1 },
  toBox: { borderLeft: "3 solid #4c1d95", paddingLeft: 8, marginBottom: 14 },
  toName: { fontSize: 14, fontWeight: "bold", color: "#0f172a" },
  toSub: { fontSize: 8, color: "#64748b", marginTop: 2 },
  subjectBar: { backgroundColor: "#f5f3ff", border: "1 solid #ddd6fe", borderRadius: 3, padding: "6 10", marginBottom: 12 },
  subjectText: { fontSize: 11, fontWeight: "bold", color: "#4c1d95" },
  table: { marginBottom: 12 },
  thead: { flexDirection: "row", backgroundColor: "#4c1d95", borderRadius: "2 2 0 0" },
  theadCell: { color: "#fff", fontSize: 8, fontWeight: "bold", padding: "5 6" },
  trow: { flexDirection: "row", borderBottom: "1 solid #f1f5f9" },
  trowAlt: { flexDirection: "row", borderBottom: "1 solid #f1f5f9", backgroundColor: "#f8fafc" },
  tcell: { fontSize: 9, padding: "5 6", color: "#334155" },
  colDesc: { flex: 3.5 },
  colQty: { width: 40, textAlign: "right" },
  colUnit: { width: 28, textAlign: "center" },
  colPrice: { width: 68, textAlign: "right" },
  colAmt: { width: 68, textAlign: "right" },
  totalsBox: { alignItems: "flex-end", marginBottom: 14 },
  totalRow: { flexDirection: "row", width: 200, marginBottom: 3 },
  totalLabel: { flex: 1, color: "#64748b", fontSize: 9 },
  totalVal: { width: 85, textAlign: "right", fontSize: 9 },
  grandBox: { flexDirection: "row", width: 200, backgroundColor: "#4c1d95", borderRadius: 3, padding: "6 8", marginTop: 4 },
  grandLabel: { flex: 1, color: "#fff", fontWeight: "bold", fontSize: 11 },
  grandVal: { width: 85, textAlign: "right", color: "#fff", fontWeight: "bold", fontSize: 11 },
  bankBox: { border: "1 solid #e2e8f0", borderRadius: 3, padding: 8, marginBottom: 6 },
  bankLabel: { fontSize: 8, color: "#94a3b8", marginBottom: 3, fontWeight: "bold" },
  notesBox: { border: "1 solid #e2e8f0", borderRadius: 3, padding: 8 },
  notesLabel: { fontSize: 8, color: "#94a3b8", marginBottom: 3 },
  invoiceBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#f0fdf4", border: "1 solid #bbf7d0", borderRadius: 3, padding: "3 6", marginTop: 6 },
  invoiceBadgeText: { fontSize: 7.5, color: "#15803d" },
})

function yen(n: number) { return `¥${n.toLocaleString("ja-JP")}` }
function dt(d: any) { return d ? new Date(d).toLocaleDateString("ja-JP") : "" }

export function InvoicePdf({ invoice, company }: { invoice: any; company: any }) {
  return (
    <Document>
      <Page size="A4" style={S.page}>
        <View style={S.titleBar}>
          <Text style={S.titleText}>請 求 書</Text>
          <Text style={S.titleSub}>INVOICE  No. {invoice.invoiceNumber}</Text>
        </View>

        <View style={S.header}>
          <View style={S.headerLeft}>
            <View style={S.toBox}>
              <Text style={S.toName}>{invoice.client?.name} 御中</Text>
              {invoice.client?.contactPerson && (
                <Text style={S.toSub}>{invoice.client.contactPerson} 様</Text>
              )}
            </View>
            <View style={S.subjectBar}>
              <Text style={S.subjectText}>{invoice.title}</Text>
            </View>
          </View>
          <View style={S.headerRight}>
            <Text style={S.companyName}>{company?.name}</Text>
            {[
              ["住所", company?.address],
              ["TEL", company?.phone],
              ["FAX", company?.fax],
              ["Mail", company?.email],
              ["発行日", dt(invoice.issueDate)],
              ["支払期限", dt(invoice.dueDate)],
            ].filter(([, v]) => v).map(([k, v]) => (
              <View key={String(k)} style={S.metaRow}>
                <Text style={S.metaLabel}>{k}</Text>
                <Text style={S.metaValue}>{v}</Text>
              </View>
            ))}
            {company?.invoiceRegistrationNumber && (
              <View style={S.invoiceBadge}>
                <Text style={S.invoiceBadgeText}>適格請求書発行事業者  {company.invoiceRegistrationNumber}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={S.table}>
          <View style={S.thead}>
            <Text style={[S.theadCell, S.colDesc]}>品目・内容</Text>
            <Text style={[S.theadCell, S.colQty]}>数量</Text>
            <Text style={[S.theadCell, S.colUnit]}>単位</Text>
            <Text style={[S.theadCell, S.colPrice]}>単価</Text>
            <Text style={[S.theadCell, S.colAmt]}>金額</Text>
          </View>
          {invoice.lineItems?.map((item: any, i: number) => (
            <View key={i} style={i % 2 === 0 ? S.trow : S.trowAlt}>
              <Text style={[S.tcell, S.colDesc]}>{item.description}</Text>
              <Text style={[S.tcell, S.colQty]}>{item.quantity}</Text>
              <Text style={[S.tcell, S.colUnit]}>{item.unit}</Text>
              <Text style={[S.tcell, S.colPrice]}>{yen(item.unitPrice)}</Text>
              <Text style={[S.tcell, S.colAmt]}>{yen(item.amount)}</Text>
            </View>
          ))}
        </View>

        <View style={S.totalsBox}>
          <View style={S.totalRow}>
            <Text style={S.totalLabel}>小計</Text>
            <Text style={S.totalVal}>{yen(invoice.subtotal)}</Text>
          </View>
          <View style={S.totalRow}>
            <Text style={S.totalLabel}>消費税（{invoice.taxRate}%）</Text>
            <Text style={S.totalVal}>{yen(invoice.taxAmount)}</Text>
          </View>
          <View style={S.grandBox}>
            <Text style={S.grandLabel}>御請求金額</Text>
            <Text style={S.grandVal}>{yen(invoice.total)}</Text>
          </View>
        </View>

        {company?.bankInfo && (
          <View style={S.bankBox}>
            <Text style={S.bankLabel}>お振込先</Text>
            <Text style={{ fontSize: 9, color: "#334155" }}>{company.bankInfo}</Text>
          </View>
        )}

        {invoice.notes && (
          <View style={S.notesBox}>
            <Text style={S.notesLabel}>備考</Text>
            <Text style={{ fontSize: 9, color: "#334155" }}>{invoice.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}
