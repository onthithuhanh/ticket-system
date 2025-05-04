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
  status: "Available" | "Blocked" | "Reserved"
  category: "Vip" | "Normal" | "Economy"
  isBooked: boolean
}

interface Room {
  id: number
  name: string
  location: string
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
    room: Room
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
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [userId, setUserId] = useState("")
  const [scheduleId, setScheduleId] = useState("")
  const [eventId, setEventId] = useState("")
  const [seatDetails, setSeatDetails] = useState<{ [key: number]: Seat }>({})

  useEffect(() => {
    fetchBookings()
  }, [currentPage, pageSize, userId, scheduleId, eventId, searchTerm, statusFilter, eventFilter])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const fromDate = new Date()
      fromDate.setFullYear(2021)
      const toDate = new Date()
      toDate.setFullYear(2029)

      let url = `/Bookings?CreatedAtFrom=${fromDate.toISOString()}&CreatedAtTo=${toDate.toISOString()}&PageSize=${pageSize}&PageIndex=${currentPage}&SortColumn=createdAt&SortDir=Desc&Status=Completed`
        console.log(url);
        
      if (userId) url += `&UserId=${userId}`
      if (scheduleId) url += `&ScheduleId=${scheduleId}`
      if (eventId) url += `&EventId=${eventId}`
      if (searchTerm) url += `&SearchTerm=${searchTerm}`
      if (statusFilter !== "all") url += `&Status=${statusFilter}`
      if (eventFilter !== "all") url += `&EventName=${eventFilter}`

      const response = await api.get(url)

      setBookings(response.data.contends)
      setTotalPages(response.data.totalPages)
      setTotalItems(response.data.totalItems)
      
      // Extract unique event names
      const uniqueEvents = Array.from(
        new Set(response.data.contends.map((booking: Booking) => booking.schedule?.event?.name))
      ).filter(Boolean) as string[]
      setEvents(uniqueEvents)
    } catch (error) {
      // toast({
      //   title: "Lỗi",
      //   description: "Không thể tải danh sách vé",
      //   variant: "destructive",
      // })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSeatDetails = async (roomId: number, scheduleId: number) => {
    try {
      const response = await api.get(`/Seats/room/${roomId}/schedule/${scheduleId}`)
      const seats = response.data
      const seatMap = seats.reduce((acc: { [key: number]: Seat }, seat: Seat) => {
        acc[seat.id] = seat
        return acc
      }, {})
      setSeatDetails(seatMap)
    } catch (error) {
      console.error("Error fetching seat details:", error)
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1) // Reset to first page when changing page size
  }

  const handleViewTicket = async (booking: Booking) => {
    setSelectedTicket(booking)
    setIsDetailDialogOpen(true)
    if (booking.schedule?.room?.id && booking.schedule?.id) {
      await fetchSeatDetails(booking.schedule.room.id, booking.schedule.id)
    }
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

  const getSeatStatus = (ticket: Ticket, eventTime: string) => {
    const now = new Date()
    const eventDate = new Date(eventTime)

    if (ticket.isUsed) {
      return { color: "text-red-500", label: "Đã sử dụng" }
    }
    if (now > eventDate) {
      return { color: "text-gray-500", label: "Đã hết hạn" }
    }
    return { color: "text-green-500", label: "Chưa sử dụng" }
  }

  const getSeatColor = (seat: Seat) => {
    if (seat.isBooked) return "bg-red-200 opacity-50 cursor-not-allowed"
    if (seat.status === "Blocked") return "bg-red-200 opacity-50 cursor-not-allowed"
    
    switch (seat.category) {
      case "Vip":
        return "bg-purple-500 text-white"
      case "Normal":
        return "bg-blue-500 text-white"
      case "Economy":
        return "bg-gray-200 text-gray-700"
      default:
        return "bg-gray-200"
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý vé</h1>
        {/* <Button>
          <Download className="mr-2 h-4 w-4" />
          Xuất báo cáo
        </Button> */}
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số vé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách vé</CardTitle>
          <CardDescription>Quản lý tất cả vé đã bán trong hệ thống</CardDescription>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">Đã sử dụng</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span className="text-sm">Đã hết hạn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Chưa sử dụng</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 md:flex-row">
          <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
              type="text"
              placeholder="Tìm kiếm theo ID người dùng"
              className="w-full pl-8"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
              type="text"
              placeholder="Schedule ID"
              className="w-full  pl-8"
              value={scheduleId}
              onChange={(e) => setScheduleId(e.target.value)}
            />
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
              type="text"
              placeholder="Tìm kiếm theo ID Sự kiện "
              className="w-full pl-8   "
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
            />
            </div>
           
         
         
            {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
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
            </Select> */}
            {/* <Select value={eventFilter} onValueChange={setEventFilter}>
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
            </Select> */}
          </div>
          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã vé</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Sự kiện</TableHead>
                  <TableHead>Lịch trình</TableHead>
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
                    <TableCell colSpan={9} className="text-center">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      Không tìm thấy vé nào
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking) => {
                    const { date, time } = formatDateTime(booking.schedule?.startTime || booking.createdAt)
                    return (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.user?.fullName || booking.user?.userName}</div>
                            <div className="text-sm text-muted-foreground">{booking.user?.email}</div>
                            <div className="text-sm text-muted-foreground">ID: {booking.user?.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.schedule?.event?.name}</div>
                            <div className="text-sm text-muted-foreground">ID: {booking.schedule?.event?.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">ID: {booking.schedule?.id}</div>
                            <div className="text-sm text-muted-foreground">
                              {date} - {time}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {booking.schedule?.room?.name} - {booking.schedule?.room?.location}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {booking.tickets.map((t) => {
                                const status = getSeatStatus(t, booking.schedule?.startTime || "")
                                return (
                                  <span key={t.id} className={`${status.color} mr-2`}>
                                    Ghế {t.seat.id} ({t.seat.category})
                                  </span>
                                )
                              })}
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

          <div className="mt-4 flex items-center justify-between">
         <CardFooter className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị {bookings.length} trên tổng số {totalItems} vé
          </p>
        </CardFooter>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              <span className="text-sm">
                Trang {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau
              </Button>
            </div>
          </div>
        </CardContent>
     
      </Card>

      {/* Dialog chi tiết vé */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="  max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết vé {selectedTicket?.id}</DialogTitle>
            <DialogDescription>Thông tin chi tiết về vé đã bán</DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Thông tin</TabsTrigger>
                <TabsTrigger value="seats">Sơ đồ ghế</TabsTrigger>
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
                      Phòng: {selectedTicket.schedule?.room?.name} - {selectedTicket.schedule?.room?.location}
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
                    <h4 className="font-semibold">Thông tin ghế</h4>
                    {selectedTicket.tickets.map((ticket: Ticket) => {
                      const seatDetail = seatDetails[ticket.seat.id]
                      return (
                        <div key={ticket.id} className="mb-2">
                          <p className="text-sm text-muted-foreground">
                            Ghế {ticket.seat.id} - {seatDetail?.category || ticket.seat.category}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Trạng thái: {ticket.isUsed ? "Đã sử dụng" : "Chưa sử dụng"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Loại ghế: {
                              seatDetail?.category === "Vip" ? "VIP" :
                              seatDetail?.category === "Normal" ? "Thường" :
                              seatDetail?.category === "Economy" ? "Tiết kiệm" : "Không xác định"
                            }
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="seats" className="space-y-4">
                <div className="p-4 space-y-6">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-purple-500" />
                      <span>VIP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-blue-500" />
                      <span>Thường</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-gray-200" />
                      <span>Tiết kiệm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-red-200 rounded-full" />
                      <span>Không sử dụng</span>
                    </div>
                  </div>

                  <div 
                    className="grid gap-2 overflow-x-auto" 
                    style={{ 
                      gridTemplateColumns: `repeat(${selectedTicket.schedule?.room?.numberSeatsOfRow || 0}, minmax(0, 1fr))`,
                      maxWidth: '100%'
                    }}
                  >
                    {Object.values(seatDetails).map((seat) => (
                      <div
                        key={seat.id}
                        className={`h-8 w-8 rounded flex items-center justify-center text-xs font-medium ${getSeatColor(seat)}`}
                      >
                        {seat.id}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Ghế đã đặt:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTicket.tickets.map((ticket: Ticket) => {
                        const seatDetail = seatDetails[ticket.seat.id]
                        return (
                          <Badge key={ticket.id} variant="secondary">
                            Ghế {ticket.seat.id} - {
                              seatDetail?.category === "Vip" ? "VIP" :
                              seatDetail?.category === "Normal" ? "Thường" :
                              seatDetail?.category === "Economy" ? "Tiết kiệm" : "Không xác định"
                            }
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
