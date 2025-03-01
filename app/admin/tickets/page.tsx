"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Eye, MoreHorizontal } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminTicketsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [eventFilter, setEventFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  // Dữ liệu mẫu cho vé
  const tickets = [
    {
      id: "TK001",
      customerName: "Nguyễn Thị Hương",
      customerEmail: "huong.nguyen@example.com",
      customerPhone: "0912345678",
      eventTitle: "Vở Kịch: Lôi Vũ",
      eventDate: "20/06/2023",
      eventTime: "19:30",
      seats: ["VIP-5", "VIP-6"],
      seatType: "VIP",
      quantity: 2,
      unitPrice: 500000,
      totalAmount: 1000000,
      purchaseDate: "15/06/2023 14:30",
      status: "confirmed",
      paymentMethod: "credit_card",
      qrCode: "QR123456789",
      checkInTime: null,
      notes: "",
    },
    {
      id: "TK002",
      customerName: "Trần Văn Lâm",
      customerEmail: "lam.tran@example.com",
      customerPhone: "0987654321",
      eventTitle: "Hòa Nhạc Mùa Hè",
      eventDate: "25/06/2023",
      eventTime: "20:00",
      seats: ["STD-15"],
      seatType: "Standard",
      quantity: 1,
      unitPrice: 300000,
      totalAmount: 300000,
      purchaseDate: "16/06/2023 09:15",
      status: "confirmed",
      paymentMethod: "bank_transfer",
      qrCode: "QR987654321",
      checkInTime: null,
      notes: "",
    },
    {
      id: "TK003",
      customerName: "Phạm Minh Hiếu",
      customerEmail: "hieu.pham@example.com",
      customerPhone: "0901234567",
      eventTitle: "Múa Ballet: Hồ Thiên Nga",
      eventDate: "30/06/2023",
      eventTime: "19:00",
      seats: ["ECO-22", "ECO-23", "ECO-24"],
      seatType: "Economy",
      quantity: 3,
      unitPrice: 200000,
      totalAmount: 600000,
      purchaseDate: "17/06/2023 16:45",
      status: "confirmed",
      paymentMethod: "momo",
      qrCode: "QR456789123",
      checkInTime: null,
      notes: "",
    },
    {
      id: "TK004",
      customerName: "Lê Thị Mai",
      customerEmail: "mai.le@example.com",
      customerPhone: "0934567890",
      eventTitle: "Xiếc: Đêm Kỳ Diệu",
      eventDate: "15/05/2023",
      eventTime: "18:00",
      seats: ["STD-8", "STD-9"],
      seatType: "Standard",
      quantity: 2,
      unitPrice: 300000,
      totalAmount: 600000,
      purchaseDate: "10/05/2023 11:20",
      status: "used",
      paymentMethod: "vnpay",
      qrCode: "QR789123456",
      checkInTime: "15/05/2023 17:45",
      notes: "Đã check-in thành công",
    },
    {
      id: "TK005",
      customerName: "Vũ Đức Anh",
      customerEmail: "anh.vu@example.com",
      customerPhone: "0945678901",
      eventTitle: "Kịch: Romeo và Juliet",
      eventDate: "10/05/2023",
      eventTime: "19:00",
      seats: ["VIP-1"],
      seatType: "VIP",
      quantity: 1,
      unitPrice: 500000,
      totalAmount: 500000,
      purchaseDate: "05/05/2023 13:10",
      status: "cancelled",
      paymentMethod: "credit_card",
      qrCode: "QR321654987",
      checkInTime: null,
      notes: "Hủy theo yêu cầu khách hàng",
    },
  ]

  const events = [
    "Vở Kịch: Lôi Vũ",
    "Hòa Nhạc Mùa Hè",
    "Múa Ballet: Hồ Thiên Nga",
    "Xiếc: Đêm Kỳ Diệu",
    "Kịch: Romeo và Juliet",
  ]

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesEvent = eventFilter === "all" || ticket.eventTitle === eventFilter
    return matchesSearch && matchesStatus && matchesEvent
  })

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket)
    setIsDetailDialogOpen(true)
  }

  const handleCancelTicket = (ticketId: string) => {
    toast({
      title: "Đã hủy vé",
      description: `Vé ${ticketId} đã được hủy thành công`,
    })
  }

  const handleRefundTicket = (ticketId: string) => {
    toast({
      title: "Đã hoàn tiền",
      description: `Đã xử lý hoàn tiền cho vé ${ticketId}`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Đã xác nhận</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Chờ xử lý</Badge>
      case "used":
        return <Badge className="bg-blue-500">Đã sử dụng</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Đã hủy</Badge>
      case "refunded":
        return <Badge className="bg-gray-500">Đã hoàn tiền</Badge>
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
  const totalTickets = tickets.length
  const confirmedTickets = tickets.filter((t) => t.status === "confirmed").length
  const usedTickets = tickets.filter((t) => t.status === "used").length
  const cancelledTickets = tickets.filter((t) => t.status === "cancelled").length
  const totalRevenue = tickets.filter((t) => t.status !== "cancelled").reduce((sum, t) => sum + t.totalAmount, 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý vé</h1>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Xuất báo cáo
        </Button>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số vé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xác nhận</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{confirmedTickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã sử dụng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{usedTickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã hủy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{cancelledTickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString()}đ</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách vé</CardTitle>
          <CardDescription>Quản lý tất cả vé đã bán trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm vé, khách hàng..."
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
                <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="used">Đã sử dụng</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
                <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
              </SelectContent>
            </Select>
            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Sự kiện" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả sự kiện</SelectItem>
                {events.map((event) => (
                  <SelectItem key={event} value={event}>
                    {event}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã vé</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Sự kiện</TableHead>
                  <TableHead>Ghế</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày mua</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Không tìm thấy vé nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ticket.customerName}</div>
                          <div className="text-sm text-muted-foreground">{ticket.customerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ticket.eventTitle}</div>
                          <div className="text-sm text-muted-foreground">
                            {ticket.eventDate} - {ticket.eventTime}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ticket.seats.join(", ")}</div>
                          <div className="text-sm text-muted-foreground">
                            {ticket.seatType} ({ticket.quantity} vé)
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{ticket.totalAmount.toLocaleString()}đ</TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>{ticket.purchaseDate}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleViewTicket(ticket)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {ticket.status === "confirmed" && (
                              <DropdownMenuItem onClick={() => handleCancelTicket(ticket.id)}>Hủy vé</DropdownMenuItem>
                            )}
                            {ticket.status === "cancelled" && (
                              <DropdownMenuItem onClick={() => handleRefundTicket(ticket.id)}>
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
            Hiển thị {filteredTickets.length} trên tổng số {tickets.length} vé
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

      {/* Dialog chi tiết vé */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chi tiết vé {selectedTicket?.id}</DialogTitle>
            <DialogDescription>Thông tin chi tiết về vé đã bán</DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Thông tin</TabsTrigger>
                <TabsTrigger value="qr">Mã QR</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold">Thông tin khách hàng</h4>
                    <p className="text-sm text-muted-foreground">Tên: {selectedTicket.customerName}</p>
                    <p className="text-sm text-muted-foreground">Email: {selectedTicket.customerEmail}</p>
                    <p className="text-sm text-muted-foreground">SĐT: {selectedTicket.customerPhone}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Thông tin sự kiện</h4>
                    <p className="text-sm text-muted-foreground">Tên: {selectedTicket.eventTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      Ngày: {selectedTicket.eventDate} - {selectedTicket.eventTime}
                    </p>
                    <p className="text-sm text-muted-foreground">Ghế: {selectedTicket.seats.join(", ")}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Thông tin thanh toán</h4>
                    <p className="text-sm text-muted-foreground">
                      Phương thức: {getPaymentMethodText(selectedTicket.paymentMethod)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Số tiền: {selectedTicket.totalAmount.toLocaleString()}đ
                    </p>
                    <p className="text-sm text-muted-foreground">Ngày mua: {selectedTicket.purchaseDate}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Trạng thái</h4>
                    <div className="mb-2">{getStatusBadge(selectedTicket.status)}</div>
                    {selectedTicket.checkInTime && (
                      <p className="text-sm text-muted-foreground">Check-in: {selectedTicket.checkInTime}</p>
                    )}
                    {selectedTicket.notes && (
                      <p className="text-sm text-muted-foreground">Ghi chú: {selectedTicket.notes}</p>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="qr" className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-48 w-48 bg-gray-100 flex items-center justify-center rounded-lg">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📱</div>
                      <p className="text-sm text-muted-foreground">Mã QR: {selectedTicket.qrCode}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Khách hàng sử dụng mã QR này để check-in tại sự kiện
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
