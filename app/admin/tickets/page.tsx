"use client"

import { useState, useEffect } from "react"
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
import { api } from "@/lib/api"

interface Seat {
  id: number
  index: number
  status: string
  category: string
}

interface Ticket {
  id: number
  price: number
  qrCode: string
  isUsed: boolean
  bookingId: string
  seatId: number
  seat: Seat
  createdAt: string
  createdBy: string
  modifiedBy: string
  modifiedAt: string
  deletedBy: string | null
  deletedAt: string | null
}

interface Booking {
  id: string
  totalPrice: number
  status: string
  method: string
  createdAt: string
  user: {
    id: string
    userName: string
    email: string
    fullName: string
  }
  schedule: {
    id: number
    startTime: string
    event: {
      id: number
      name: string
    }
    room: {
      name: string
      location: string
    }
  }
  tickets: Ticket[]
}

interface PaginatedResponse {
  page: number
  size: number
  totalPages: number
  totalItems: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  contends: Booking[]
}

export default function AdminTicketsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [eventFilter, setEventFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [events, setEvents] = useState<string[]>([])

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const fromDate = new Date()
      fromDate.setFullYear(2021)
      const toDate = new Date()
      toDate.setFullYear(2029)

      const response = await api.get(
        `/Bookings?CreatedAtFrom=${fromDate.toISOString()}&CreatedAtTo=${toDate.toISOString()}&Status=Completed`
      )

      setBookings(response.data.contends)
      
      // Extract unique event names
      const uniqueEvents = Array.from(
        new Set(response.data.contends.map((booking: Booking) => booking.schedule?.event?.name))
      ).filter(Boolean) as string[]
      setEvents(uniqueEvents)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách vé",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEvent = eventFilter === "all" || booking.schedule?.event?.name === eventFilter
    return matchesSearch && matchesEvent
  })

  const handleViewTicket = (booking: Booking) => {
    setSelectedTicket(booking)
    setIsDetailDialogOpen(true)
  }

  const handleCancelTicket = async (bookingId: string) => {
    try {
      await api.put(`/Bookings/${bookingId}/cancel`)
      toast({
        title: "Thành công",
        description: "Đã hủy vé thành công",
      })
      fetchBookings()
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể hủy vé",
        variant: "destructive",
      })
    }
  }

  const handleRefundTicket = async (bookingId: string) => {
    try {
      await api.put(`/Bookings/${bookingId}/refund`)
      toast({
        title: "Thành công",
        description: "Đã hoàn tiền thành công",
      })
      fetchBookings()
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể hoàn tiền",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-500">Thành công</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Chờ xử lý</Badge>
      case "failed":
        return <Badge className="bg-red-500">Thất bại</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Đã hủy</Badge>
      case "refunded":
        return <Badge className="bg-gray-500">Đã hoàn tiền</Badge>
      default:
        return <Badge>Không xác định</Badge>
    }
  }

  const getPaymentMethodText = (method: string) => {
    switch (method.toLowerCase()) {
      case "credit_card":
        return "Thẻ tín dụng"
      case "bank_transfer":
        return "Chuyển khoản"
      case "momo":
        return "Ví MoMo"
      case "vnpay":
        return "VNPay"
      default:
        return method
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("vi-VN"),
      time: date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  // Thống kê
  const totalTickets = bookings.length
  const completedTickets = bookings.filter((b) => b.status.toLowerCase() === "completed").length
  const usedTickets = bookings.filter((b) => b.tickets.some((t) => t.isUsed)).length
  const cancelledTickets = bookings.filter((b) => b.status.toLowerCase() === "cancelled").length
  const totalRevenue = bookings
    .filter((b) => b.status.toLowerCase() === "completed")
    .reduce((sum, b) => sum + b.totalPrice, 0)

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
            <div className="text-2xl font-bold text-green-600">{completedTickets}</div>
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
                <SelectItem value="completed">Thành công</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Không tìm thấy vé nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking) => {
                    const { date, time } = formatDateTime(booking.schedule?.startTime || booking.createdAt)
                    return (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.user?.fullName || booking.user?.userName}</div>
                            <div className="text-sm text-muted-foreground">{booking.user?.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.schedule?.event?.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {date} - {time}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {booking.tickets.map((t) => `Ghế ${t.seat.id}`).join(", ")}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {booking.tickets.length} vé
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{booking.totalPrice.toLocaleString()}đ</TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>{formatDateTime(booking.createdAt).date}</TableCell>
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
                              <DropdownMenuItem onClick={() => handleViewTicket(booking)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {booking.status.toLowerCase() === "completed" && (
                                <DropdownMenuItem onClick={() => handleCancelTicket(booking.id)}>
                                  Hủy vé
                                </DropdownMenuItem>
                              )}
                              {booking.status.toLowerCase() === "cancelled" && (
                                <DropdownMenuItem onClick={() => handleRefundTicket(booking.id)}>
                                  Hoàn tiền
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị {filteredBookings.length} trên tổng số {bookings.length} vé
          </p>
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
                    <p className="text-sm text-muted-foreground">
                      Tên: {selectedTicket.user?.fullName || selectedTicket.user?.userName}
                    </p>
                    <p className="text-sm text-muted-foreground">Email: {selectedTicket.user?.email}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Thông tin sự kiện</h4>
                    <p className="text-sm text-muted-foreground">Tên: {selectedTicket.schedule?.event?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Ngày: {formatDateTime(selectedTicket.schedule?.startTime).date} -{" "}
                      {formatDateTime(selectedTicket.schedule?.startTime).time}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ghế: {selectedTicket.tickets.map((t: Ticket) => `Ghế ${t.seat.id}`).join(", ")}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Thông tin thanh toán</h4>
                    <p className="text-sm text-muted-foreground">
                      Phương thức: {getPaymentMethodText(selectedTicket.method)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Số tiền: {selectedTicket.totalPrice.toLocaleString()}đ
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ngày mua: {formatDateTime(selectedTicket.createdAt).date}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Trạng thái</h4>
                    <div className="mb-2">{getStatusBadge(selectedTicket.status)}</div>
                    {selectedTicket.tickets.some((t: Ticket) => t.isUsed) && (
                      <p className="text-sm text-muted-foreground">Đã check-in</p>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="qr" className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  {selectedTicket.tickets.map((ticket: Ticket) => (
                    <div key={ticket.id} className="h-48 w-48 bg-gray-100 flex items-center justify-center rounded-lg">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📱</div>
                        <p className="text-sm text-muted-foreground">Mã QR: {ticket.qrCode}</p>
                        <p className="text-sm text-muted-foreground">Ghế: {ticket.seat.id}</p>
                      </div>
                    </div>
                  ))}
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
