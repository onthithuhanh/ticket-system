"use client"

import { MainNav } from "@/components/main-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, CreditCard, Calendar } from "lucide-react"

export default function TransactionsPage() {
  // Dữ liệu mẫu cho lịch sử giao dịch
  const transactions = [
    {
      id: "TRANS-001",
      date: "20/06/2023",
      type: "purchase",
      amount: 1000000,
      status: "completed",
      description: "Mua vé xem kịch Lôi Vũ",
      paymentMethod: "credit_card",
    },
    {
      id: "TRANS-002",
      date: "25/06/2023",
      type: "refund",
      amount: -300000,
      status: "completed",
      description: "Hoàn tiền vé Hòa Nhạc Mùa Hè",
      paymentMethod: "credit_card",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Hoàn thành</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Đang xử lý</Badge>
      case "failed":
        return <Badge className="bg-red-500">Thất bại</Badge>
      default:
        return <Badge>Không xác định</Badge>
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "credit_card":
        return <CreditCard className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container-custom flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container-custom py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Lịch sử giao dịch</h1>
            <p className="mt-2 text-muted-foreground">Xem lại các giao dịch của bạn</p>
          </div>

          <Card className="mt-8 p-4">
            <CardHeader>
              <CardTitle>Giao dịch gần đây</CardTitle>
              <CardDescription>Danh sách các giao dịch của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã giao dịch</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Phương thức</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {transaction.date}
                        </div>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(transaction.paymentMethod)}
                          {transaction.paymentMethod === "credit_card" ? "Thẻ tín dụng" : "Tiền mặt"}
                        </div>
                      </TableCell>
                      <TableCell className={transaction.amount < 0 ? "text-red-500" : "text-green-500"}>
                        {transaction.amount.toLocaleString()}đ
                      </TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 