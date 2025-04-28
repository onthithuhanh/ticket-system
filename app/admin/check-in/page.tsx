"use client"

import { useState, useEffect } from "react"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { CalendarDays, MapPin, Clock, Ticket, CheckCircle2, XCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

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

export default function CheckInPage() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [bookingId, setBookingId] = useState("")
  const [booking, setBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingIn, setIsCheckingIn] = useState(false)

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      setBookingId(id)
      handleSearch(id)
    }
  }, [searchParams])

  const handleSearch = async (id?: string) => {
    const searchId = id || bookingId
    if (!searchId.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mã đặt vé",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      const response = await api.get(`/Bookings/${searchId}`)
      setBooking(response.data)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin đặt vé",
        variant: "destructive",
      })
      setBooking(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckIn = async (ticketId: number) => {
    try {
      const now = new Date()
      const showTime = new Date(booking?.schedule.startTime || "")
      const timeDiff = showTime.getTime() - now.getTime()
      const minutesDiff = Math.floor(timeDiff / (1000 * 60))

      if (minutesDiff > 30) {
        toast({
          title: "Lỗi",
          description: "Chỉ có thể check-in trước 30 phút khi công chiếu",
          variant: "destructive",
        })
        return
      }

      if (minutesDiff < -30) {
        toast({
          title: "Lỗi",
          description: "Đã quá thời gian check-in (hơn 30 phút sau công chiếu)",
          variant: "destructive",
        })
        return
      }

      setIsCheckingIn(true)
      await api.put(`/CheckIns/ticket/${ticketId}`)
      toast({
        title: "Thành công",
        description: "Đã xác nhận sử dụng vé",
      })
      // Refresh booking data
      handleSearch()
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xác nhận sử dụng vé",
        variant: "destructive",
      })
    } finally {
      setIsCheckingIn(false)
    }
  }

  const handleCheckInAll = async () => {
    if (!booking) return

    try {
      const now = new Date()
      const showTime = new Date(booking.schedule.startTime)
      const timeDiff = showTime.getTime() - now.getTime()
      const minutesDiff = Math.floor(timeDiff / (1000 * 60))

      if (minutesDiff > 30) {
        toast({
          title: "Lỗi",
          description: "Chỉ có thể check-in trước 30 phút khi công chiếu",
          variant: "destructive",
        })
        return
      }

      if (minutesDiff < -30) {
        toast({
          title: "Lỗi",
          description: "Đã quá thời gian check-in (hơn 30 phút sau công chiếu)",
          variant: "destructive",
        })
        return
      }

      setIsCheckingIn(true)
      await api.put(`/CheckIns/booking/${booking.id}`)
      toast({
        title: "Thành công",
        description: "Đã xác nhận sử dụng tất cả vé",
      })
      // Refresh booking data
      handleSearch()
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xác nhận sử dụng vé",
        variant: "destructive",
      })
    } finally {
      setIsCheckingIn(false)
    }
  }

  const getCheckInStatus = (startTime: string) => {
    const now = new Date()
    const showTime = new Date(startTime)
    const timeDiff = showTime.getTime() - now.getTime()
    const minutesDiff = Math.floor(timeDiff / (1000 * 60))

    if (minutesDiff > 30) {
      return { 
        canCheckIn: false, 
        message: "Chưa đến thời gian check-in (30 phút trước công chiếu)" 
      }
    }
    if (minutesDiff < -30) {
      return { 
        canCheckIn: false, 
        message: "Đã quá thời gian check-in (hơn 30 phút sau công chiếu)" 
      }
    }
    return { 
      canCheckIn: true, 
      message: "Có thể check-in" 
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("vi-VN"),
      time: date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  const getSeatCategoryBadge = (category: string) => {
    switch (category.toLowerCase()) {
      case "vip":
        return <Badge className="bg-purple-500">VIP</Badge>
      case "standard":
        return <Badge className="bg-blue-500">Standard</Badge>
      default:
        return <Badge>{category}</Badge>
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
   
      <main className="flex-1">
        <div className="container-custom py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Check-in vé</h1>
            <p className="mt-2 text-muted-foreground">Xác nhận sử dụng vé cho khách hàng</p>
          </div>

          <div className="mx-auto mt-8 max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Tìm kiếm đặt vé</CardTitle>
                <CardDescription>Nhập mã đặt vé để kiểm tra và xác nhận sử dụng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    placeholder="Nhập mã đặt vé..."
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={() => handleSearch()} disabled={isLoading}>
                    {isLoading ? "Đang tìm..." : "Tìm kiếm"}
                  </Button>
                </div>

                {booking && (
                  <div className="mt-6 space-y-6">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-semibold">{booking.schedule.event.name}</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {formatDateTime(booking.schedule.startTime).date} -{" "}
                            {formatDateTime(booking.schedule.startTime).time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.schedule.room.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Ticket className="h-4 w-4 text-muted-foreground" />
                          <span>Mã đặt vé: {booking.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Danh sách vé</h3>
                        {booking.tickets.some(ticket => !ticket.isUsed) && (
                          <>
                            {getCheckInStatus(booking.schedule.startTime).canCheckIn ? (
                              <Button
                                onClick={handleCheckInAll}
                                disabled={isCheckingIn}
                                className="gap-2"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Check-in tất cả
                              </Button>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">
                                {getCheckInStatus(booking.schedule.startTime).message}
                              </Badge>
                            )}
                          </>
                        )}
                      </div>
                      {booking.tickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className="flex flex-col items-start justify-between rounded-lg border p-4 sm:flex-row sm:items-center"
                        >
                          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Ghế {ticket.seat.id}</span>
                              {getSeatCategoryBadge(ticket.seat.category)}
                            </div>
                            {ticket.isUsed ? (
                              <Badge className="bg-red-500">Đã sử dụng</Badge>
                            ) : (
                              <Badge className="bg-green-500">Chưa sử dụng</Badge>
                            )}
                          </div>
                          {!ticket.isUsed && (
                            <div className="mt-2 sm:mt-0">
                              {getCheckInStatus(booking.schedule.startTime).canCheckIn ? (
                                <Button
                                  onClick={() => handleCheckIn(ticket.id)}
                                  disabled={isCheckingIn}
                                  className="gap-2"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                  Xác nhận sử dụng
                                </Button>
                              ) : (
                                <Badge variant="outline" className="text-muted-foreground">
                                  {getCheckInStatus(booking.schedule.startTime).message}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
} 