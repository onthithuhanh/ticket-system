"use client"

import { useState, useEffect } from "react"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, MapPin, Clock, Ticket, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { ReviewDialog } from "@/components/review-dialog"

interface User {
  id: string
  email: string
  fullName: string
  userName: string
}

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
  booking?: Booking
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

export default function UserTicketsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đăng nhập để xem vé",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const userStr = localStorage.getItem("user")
      if (!userStr) {
        router.push("/login")
        return
      }
      const user = JSON.parse(userStr)

      const fromDate = new Date()
      fromDate.setFullYear(2021)
      const toDate = new Date()
      toDate.setFullYear(2029)

      const response = await api.get(
        `/Bookings?UserId=${user.id}&CreatedAtFrom=${fromDate.toISOString()}&CreatedAtTo=${toDate.toISOString()}`
      )

      setBookings(response.data.contends)
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

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-500">Thành công</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Chờ xử lý</Badge>
      case "failed":
        return <Badge className="bg-red-500">Thất bại</Badge>
      default:
        return <Badge>Không xác định</Badge>
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("vi-VN"),
      time: date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  const upcomingBookings = bookings.filter((booking) => {
    if (!booking.schedule?.startTime) return false
    return booking.status.toLowerCase() === "completed" && new Date(booking.schedule.startTime) > new Date()
  })

  const pastBookings = bookings.filter((booking) => {
    if (!booking.schedule?.startTime) return false
    return booking.status.toLowerCase() === "completed" && new Date(booking.schedule.startTime) <= new Date()
  })

  const getTicketStatusBadge = (ticket: Ticket) => {
    if (ticket.isUsed) {
      return <Badge className="bg-red-500">Đã sử dụng</Badge>
    }
    
    if (!ticket.booking?.schedule?.startTime) {
      return <Badge className="bg-green-500">Chưa sử dụng</Badge>
    }
    
    const startTime = new Date(ticket.booking.schedule.startTime)
    const now = new Date()
    const diffHours = (now.getTime() - startTime.getTime()) / (1000 * 60 * 60)
    
    if (diffHours > 1) {
      return <Badge className="bg-gray-500">Hết hạn</Badge>
    }
    
    return <Badge className="bg-green-500">Chưa sử dụng</Badge>
  }

  const getSeatCategoryBadge = (category: string) => {
    switch (category.toLowerCase()) {
      case "vip":
        return <Badge className="bg-purple-500">VIP</Badge>
      case "standard":
        return <Badge className="bg-blue-500">Thường</Badge>
      default:
        return <Badge>Tiết kiệm</Badge>
    }
  }

  const handleReviewClick = (bookingId: string) => {
    setSelectedBookingId(bookingId)
    setIsReviewDialogOpen(true)
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
            <h1 className="text-3xl font-bold tracking-tight">Vé của tôi</h1>
            <p className="mt-2 text-muted-foreground">Quản lý và xem thông tin vé của bạn</p>
          </div>

          <Tabs defaultValue="upcoming" className="mt-8" onValueChange={setActiveTab}>
            <div className="flex justify-center">
              <TabsList>
                <TabsTrigger value="upcoming">Sắp tới</TabsTrigger>
                <TabsTrigger value="past">Đã qua</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="upcoming" className="mt-6">
              {isLoading ? (
                <div className="text-center">Đang tải dữ liệu...</div>
              ) : upcomingBookings.length === 0 ? (
                <div className="text-center text-muted-foreground">Chưa có vé nào</div>
              ) : (
                <div className="grid gap-6">
                  {upcomingBookings.map((booking) => {
                    const { date, time } = formatDateTime(booking.schedule?.startTime || booking.createdAt)
                    return (
                      <Card key={booking.id} className="p-4">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle>{booking.schedule?.event?.name || "Không có tên sự kiện"}</CardTitle>
                              <CardDescription>Mã đặt vé: {booking.id}</CardDescription>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                <span>{date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{booking.schedule?.room?.location || "Không có địa điểm"}</span>
                              </div>
                              <div className="space-y-1">
                                {booking.tickets.map((ticket) => (
                                  <div key={ticket.id} className="flex items-center justify-between border-b pb-2">
                                    <div className="flex items-center gap-2">
                                      <Ticket className="h-4 w-4 text-muted-foreground" />
                                      <div className="flex items-center gap-2">
                                        <span>Ghế {ticket.seat.id}</span>
                                        {getSeatCategoryBadge(ticket.seat.category)}
                                      </div>
                                    </div>
                                    {getTicketStatusBadge(ticket)}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-col items-end justify-between">
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Tổng tiền</p>
                                <p className="text-2xl font-bold">{booking.totalPrice.toLocaleString()}đ</p>
                              </div>
                              {/* <Button variant="outline" className="mt-4">
                                <Download className="mr-2 h-4 w-4" />
                                Tải vé
                              </Button> */}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>
            <TabsContent value="past" className="mt-6">
              {isLoading ? (
                <div className="text-center">Đang tải dữ liệu...</div>
              ) : pastBookings.length === 0 ? (
                <div className="text-center text-muted-foreground">Chưa có vé nào</div>
              ) : (
                <div className="grid gap-6">
                  {pastBookings.map((booking) => {
                    const { date, time } = formatDateTime(booking.schedule?.startTime || booking.createdAt)
                    return (
                      <Card key={booking.id} className="p-4">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle>{booking.schedule?.event?.name || "Không có tên sự kiện"}</CardTitle>
                              <CardDescription>Mã đặt vé: {booking.id}</CardDescription>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                <span>{date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{booking.schedule?.room?.location || "Không có địa điểm"}</span>
                              </div>
                              <div className="space-y-1">
                                {booking.tickets.map((ticket) => (
                                  <div key={ticket.id} className="flex items-center justify-between border-b pb-2">
                                    <div className="flex items-center gap-2">
                                      <Ticket className="h-4 w-4 text-muted-foreground" />
                                      <div className="flex items-center gap-2">
                                        <span>Ghế {ticket.seat.id}</span>
                                        {getSeatCategoryBadge(ticket.seat.category)}
                                      </div>
                                    </div>
                                    {getTicketStatusBadge(ticket)}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-col items-end justify-between">
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Tổng tiền</p>
                                <p className="text-2xl font-bold">{booking.totalPrice.toLocaleString()}đ</p>
                              </div>
                              {activeTab === "past" && (
                                <Button
                                  variant="outline"
                                  className="mt-4"
                                  onClick={() => handleReviewClick(booking.id)}
                                >
                                  Đánh giá
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <ReviewDialog
        isOpen={isReviewDialogOpen}
        onClose={() => {
          setIsReviewDialogOpen(false)
          setSelectedBookingId(null)
        }}
        bookingId={selectedBookingId || ""}
      />
    </div>
  )
} 