"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Eye, MoreHorizontal, DollarSign, CreditCard, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AdminTransactionsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all")
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  // Dữ liệu mẫu cho giao dịch
  const transactions = [
    {
      id: "TXN001",
      ticketId: "TK001",
      customerName: "Nguyễn Thị Hương",
      customerEmail: "huong.nguyen@example.com",
      eventTitle: "Vở Kịch: Lôi Vũ",
      amount: 1000000,
      paymentMethod: "credit_card",
      status: "completed",
      transactionDate: "15/06/2023 14:30:25",
      paymentGateway: "VNPay",
      transactionFee: 25000,
      netAmount: 975000,
      refNumber: "REF123456789",
      description: "Thanh toán vé xem kịch",
    },
    {
      id: "TXN002",
      ticketId: "TK002",
      customerName: "Trần Văn Lâm",
      customerEmail: "lam.tran@example.com",
      eventTitle: "Hòa Nhạc Mùa Hè",
      amount: 300000,
      paymentMethod: "bank_transfer",
      status: "completed",
      transactionDate: "16/06/2023 09:15:10",
      paymentGateway: "Vietcombank",
      transactionFee: 5000,
      netAmount: 295000,
      refNumber: "REF987654321",
      description: "Chuyển khoản mua vé hòa nhạc",
    },
    {
      id: "TXN003",
      ticketId: "TK003",
      customerName: "Phạm Minh Hiếu",
      customerEmail: "hieu.pham@example.com",
      eventTitle: "Múa Ballet: Hồ Thiên Nga",
      amount: 600000,
      paymentMethod: "momo",
      status: "completed",
      transactionDate: "17/06/2023 16:45:33",
      paymentGateway: "MoMo",
      transactionFee: 15000,
      netAmount: 585000,
      refNumber: "REF456789123",
      description: "Thanh toán qua ví MoMo",
    },
    {
      id: "TXN004",
      ticketId: "TK004",
      customerName: "Lê Thị Mai",
      customerEmail: "mai.le@example.com",
      eventTitle: "Xiếc: Đêm Kỳ Diệu",
      amount: 600000,
      paymentMethod: "vnpay",
      status: "completed",
      transactionDate: "10/05/2023 11:20:15",
      paymentGateway: "VNPay",
      transactionFee: 15000,
      netAmount: 585000,
      refNumber: "REF789123456",
      description: "Thanh toán vé xiếc",
    },
    {
      id: "TXN005",
      ticketId: "TK005",
      customerName: "Vũ Đức Anh",
      customerEmail: "anh.vu@example.com",
      eventTitle: "Kịch: Romeo và Juliet",
      amount: 500000,
      paymentMethod: "credit_card",
      status: "refunded",
      transactionDate: "05/05/2023 13:10:45",
      paymentGateway: "VNPay",
      transactionFee: 12500,
      netAmount: 487500,
      refNumber: "REF321654987",
      description: "Hoàn tiền do hủy vé",
    },
    {
      id: "TXN006",
      ticketId: "TK006",
      customerName: "Hoàng Thị Lan",
      customerEmail: "lan.hoang@example.com",
      eventTitle: "Vở Kịch: Lôi Vũ",
      amount: 800000,
      paymentMethod: "bank_transfer",
      status: "pending",
      transactionDate: "21/06/2023 10:30:00",
      paymentGateway: "Techcombank",
      transactionFee: 8000,
      netAmount: 792000,
      refNumber: "REF147258369",
      description: "Chờ xác nhận chuyển khoản",
    },
    {
      id: "TXN007",
      ticketId: "TK007",
      customerName: "Đặng Văn Minh",
      customerEmail: "minh.dang@example.com",
      eventTitle: "Hòa Nhạc Mùa Hè",
      amount: 450000,
      paymentMethod: "momo",
      status: "failed",
      transactionDate: "20/06/2023 15:20:30",
      paymentGateway: "MoMo",
      transactionFee: 0,
      netAmount: 0,
      refNumber: "REF963852741",
      description: "Giao dịch thất bại - Số dư không đủ",
    },
  ]

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.refNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    const matchesPaymentMethod = paymentMethodFilter === "all" || transaction.paymentMethod === paymentMethodFilter
    return matchesSearch && matchesStatus && matchesPaymentMethod
  })

  const handleViewTransaction = (transaction: any) => {
    setSelectedTransaction(transaction)
    setIsDetailDialogOpen(true)
  }

  const handleRefundTransaction = (transactionId: string) => {
    toast({
      title: "Đã xử lý hoàn tiền",
      description: `Giao dịch ${transactionId} đã được hoàn tiền`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Thành công</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Chờ xử lý</Badge>
      case "failed":
        return <Badge className="bg-red-500">Thất bại</Badge>
      case "refunded":
        return <Badge className="bg-gray-500">Đã hoàn tiền</Badge>
      case "cancelled":
        return <Badge className="bg-orange-500">Đã hủy</Badge>
      default:
        return <Badge>Không xác định</Badge>
    }
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Thẻ tín dụng"
      case "bank_transfer":
        return "Chuyển khoản"
      case "momo":
        return "Ví MoMo"
      case "vnpay":
        return "VNPay"
      default:
        return "Không xác định"
    }
  }

  // Thống kê
  const totalTransactions = transactions.length
  const completedTransactions = transactions.filter((t) => t.status === "completed").length
  const pendingTransactions = transactions.filter((t) => t.status === "pending").length
  const failedTransactions = transactions.filter((t) => t.status === "failed").length
  const totalRevenue = transactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.amount, 0)
  const totalFees = transactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.transactionFee, 0)
  const netRevenue = transactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.netAmount, 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý giao dịch</h1>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Xuất báo cáo
        </Button>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng giao dịch</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thành công</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTransactions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingTransactions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thất bại</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedTransactions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString()}đ</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu ròng</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{netRevenue.toLocaleString()}đ</div>
            <p className="text-xs text-muted-foreground">Phí: {totalFees.toLocaleString()}đ</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách giao dịch</CardTitle>
          <CardDescription>Quản lý tất cả giao dịch thanh toán trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm giao dịch, khách hàng..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="completed">Thành công</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
                <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Phương thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phương thức</SelectItem>
                <SelectItem value="credit_card">Thẻ tín dụng</SelectItem>
                <SelectItem value="bank_transfer">Chuyển khoản</SelectItem>
                <SelectItem value="momo">Ví MoMo</SelectItem>
                <SelectItem value="vnpay">VNPay</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã GD</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Sự kiện</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Phương thức</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày GD</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Không tìm thấy giao dịch nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.customerName}</div>
                          <div className="text-sm text-muted-foreground">{transaction.customerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{transaction.eventTitle}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.amount.toLocaleString()}đ</div>
                          {transaction.status === "completed" && (
                            <div className="text-sm text-muted-foreground">
                              Ròng: {transaction.netAmount.toLocaleString()}đ
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{getPaymentMethodText(transaction.paymentMethod)}</div>
                          <div className="text-sm text-muted-foreground">{transaction.paymentGateway}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>{transaction.transactionDate}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Mở menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewTransaction(transaction)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {transaction.status === "completed" && (
                              <DropdownMenuItem onClick={() => handleRefundTransaction(transaction.id)}>
                                Hoàn tiền
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị {filteredTransactions.length} trên tổng số {transactions.length} giao dịch
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Trước
            </Button>
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              Sau
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Dialog chi tiết giao dịch */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chi tiết giao dịch {selectedTransaction?.id}</DialogTitle>
            <DialogDescription>Thông tin chi tiết về giao dịch thanh toán</DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Thông tin giao dịch</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Mã GD:</span> {selectedTransaction.id}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Mã vé:</span> {selectedTransaction.ticketId}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Mã tham chiếu:</span> {selectedTransaction.refNumber}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Ngày GD:</span> {selectedTransaction.transactionDate}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Thông tin khách hàng</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Tên:</span> {selectedTransaction.customerName}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Email:</span> {selectedTransaction.customerEmail}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Sự kiện:</span> {selectedTransaction.eventTitle}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Thông tin thanh toán</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Phương thức:</span>{" "}
                      {getPaymentMethodText(selectedTransaction.paymentMethod)}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Cổng thanh toán:</span>{" "}
                      {selectedTransaction.paymentGateway}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Trạng thái:</span>{" "}
                      {getStatusBadge(selectedTransaction.status)}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Chi tiết số tiền</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Số tiền gốc:</span>{" "}
                      {selectedTransaction.amount.toLocaleString()}đ
                    </p>
                    <p>
                      <span className="text-muted-foreground">Phí giao dịch:</span>{" "}
                      {selectedTransaction.transactionFee.toLocaleString()}đ
                    </p>
                    <p>
                      <span className="text-muted-foreground">Số tiền ròng:</span>{" "}
                      {selectedTransaction.netAmount.toLocaleString()}đ
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Mô tả</h4>
                <p className="text-sm text-muted-foreground">{selectedTransaction.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
