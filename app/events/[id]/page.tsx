"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, MapPin, Users, X } from "lucide-react"
import { eventsApi } from "@/lib/api/events"
import { useToast } from "@/hooks/use-toast"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { showtimesApi } from "@/lib/api/showtimes"

interface Seat {
  id: number
  index: number
  status: "Available" | "Blocked" | "Reserved"
  category: "Vip" | "Normal" | "Economy"
  isBooked: boolean
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [event, setEvent] = useState<any>(null)
  const [showtimes, setShowtimes] = useState<any[]>([])
  const [selectedShowtime, setSelectedShowtime] = useState<string>("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showSeatSelection, setShowSeatSelection] = useState(false)
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
  const [room, setRoom] = useState<any>(null)
  const resolvedParams = use(params)
  const { id } = resolvedParams

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch event details
        const eventResponse = await eventsApi.getEvent(parseInt(id))
        setEvent(eventResponse)

        // Fetch upcoming showtimes
        const showtimesResponse = await showtimesApi.getShowtimes({
          eventId: parseInt(id),
          StartTimeFrom: new Date().toISOString().split('T')[0],
          pageIndex: 1,
          pageSize: 10
        })
        setShowtimes(showtimesResponse.contends)
      } catch (error: any) {
        toast({
          title: "Lỗi",
          description: error.response?.data?.message || "Không thể tải thông tin vở kịch",
          variant: "destructive",
        })
        router.push("/events")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, router, toast])

  const handleShowtimeSelect = (showtimeId: string) => {
    setSelectedShowtime(showtimeId)
  }

  const handleBookTickets = async () => {
    if (!selectedShowtime) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn giờ xuất chiếu",
        variant: "destructive",
      })
      return
    }

    try {
      const selectedShowtimeData = showtimes.find(s => s.id.toString() === selectedShowtime)
      if (!selectedShowtimeData) return

      const response = await fetch(`https://stellaway.runasp.net/api/Seats/room/${selectedShowtimeData.roomId}/schedule/${selectedShowtimeData.id}`)
      const seatsData = await response.json()
      setSeats(seatsData)
      setRoom(selectedShowtimeData.room)
      setShowSeatSelection(true)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin ghế",
        variant: "destructive",
      })
    }
  }

  const getSeatColor = (seat: Seat) => {
    if (selectedSeats.find(s => s.id === seat.id)) return "bg-green-500 text-white"
    if (seat.isBooked) return "bg-gray-200 opacity-50 cursor-not-allowed"
    if (seat.status === "Blocked") return "bg-gray-200 opacity-50 cursor-not-allowed"
    
    switch (seat.category) {
      case "Vip":
        return "bg-purple-500 text-white hover:bg-purple-600"
      case "Normal":
        return "bg-blue-500 text-white hover:bg-blue-600"
      case "Economy":
        return "bg-gray-200 text-gray-700 hover:bg-gray-300"
      default:
        return "bg-gray-200"
    }
  }

  const handleSeatClick = (seat: Seat) => {
    if (seat.isBooked || seat.status === "Blocked") return

    setSelectedSeats(prev => {
      const isSelected = prev.find(s => s.id === seat.id)
      if (isSelected) {
        return prev.filter(s => s.id !== seat.id)
      }
      return [...prev, seat]
    })
  }

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => {
      const selectedShowtimeData = showtimes.find(s => s.id.toString() === selectedShowtime)
      if (!selectedShowtimeData) return total

      switch (seat.category) {
        case "Vip":
          return total + selectedShowtimeData.priceVip
        case "Normal":
          return total + selectedShowtimeData.priceNormal
        case "Economy":
          return total + selectedShowtimeData.priceEconomy
        default:
          return total
      }
    }, 0)
  }

  const handlePayment = () => {
    const selectedShowtimeData = showtimes.find(s => s.id.toString() === selectedShowtime)
    if (!selectedShowtimeData) return

    const seatsWithPrice = selectedSeats.map(seat => ({
      ...seat,
      price: seat.category === "Vip" 
        ? selectedShowtimeData.priceVip 
        : seat.category === "Normal" 
          ? selectedShowtimeData.priceNormal 
          : selectedShowtimeData.priceEconomy
    }))

    const queryParams = new URLSearchParams({
      scheduleId: selectedShowtimeData.id.toString(),
      seats: JSON.stringify(seatsWithPrice),
      totalPrice: calculateTotalPrice().toString(),
      eventName: event.name,
      showtime: new Date(selectedShowtimeData.startTime).toLocaleString('vi-VN')
    })

    router.push(`/payment?${queryParams.toString()}`)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background">
          <div className="container-custom flex h-16 items-center">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </main>
      </div>
    )
  }

  if (!event) return null

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container-custom flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container px-4 py-8 m-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/events">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">{event.name}</h1>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <Card>
                <img
                  src={event.thumbnail}
                  alt={event.name}
                  className="w-full h-[400px] object-cover cursor-pointer"
                  onClick={() => setSelectedImage(event.thumbnail)}
                />
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Mô tả ngắn</h3>
                      <p className="mt-1">{event.shortDescription}</p>
                    </div>
                    {event.detailedDescription && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Mô tả chi tiết</h3>
                        <p className="mt-1 whitespace-pre-line">{event.detailedDescription}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thông tin sản xuất</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Đạo diễn</h3>
                    <p className="mt-1">{event.director}</p>
                  </div>
                  {event.actors && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Diễn viên</h3>
                      <p className="mt-1 whitespace-pre-line">{event.actors}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Đặt vé</CardTitle>
                  <CardDescription>Chọn giờ xuất chiếu để tiếp tục</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500">Chọn giờ xuất chiếu</h3>
                    <div className="grid gap-4">
                      {showtimes.map((showtime) => (
                        <Button
                          key={showtime.id}
                          variant={selectedShowtime === showtime.id.toString() ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => handleShowtimeSelect(showtime.id.toString())}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {new Date(showtime.startTime).toLocaleDateString('vi-VN')}
                          <Clock className="ml-4 mr-2 h-4 w-4" />
                          {new Date(showtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {selectedShowtime && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-lg bg-gray-100 p-4 text-center">
                          <div className="text-sm font-medium text-gray-500">VIP</div>
                          <div className="mt-1 text-lg font-semibold">
                            {showtimes.find(s => s.id.toString() === selectedShowtime)?.priceVip.toLocaleString('vi-VN')}đ
                          </div>
                        </div>
                        <div className="rounded-lg bg-gray-100 p-4 text-center">
                          <div className="text-sm font-medium text-gray-500">Thường</div>
                          <div className="mt-1 text-lg font-semibold">
                            {showtimes.find(s => s.id.toString() === selectedShowtime)?.priceNormal.toLocaleString('vi-VN')}đ
                          </div>
                        </div>
                        <div className="rounded-lg bg-gray-100 p-4 text-center">
                          <div className="text-sm font-medium text-gray-500">Tiết kiệm</div>
                          <div className="mt-1 text-lg font-semibold">
                            {showtimes.find(s => s.id.toString() === selectedShowtime)?.priceEconomy.toLocaleString('vi-VN')}đ
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleBookTickets}
                    disabled={!selectedShowtime}
                  >
                    Tiếp tục chọn ghế
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thông tin chi tiết</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Thời lượng</p>
                      <p className="text-sm text-gray-500">{event.duration} phút</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Thể loại</p>
                      <p className="text-sm text-gray-500">{event.category}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Image Gallery Section */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Hình ảnh</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <img
                    src={event.thumbnail}
                    alt="Thumbnail"
                    className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedImage(event.thumbnail)}
                  />
                  {event.eventImages?.map((image: { imageUrl: string }, index: number) => (
                    <img
                      key={index}
                      src={image.imageUrl}
                      alt={`Image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(image.imageUrl)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Xem ảnh</span>
              <Button variant="ghost" size="icon" onClick={() => setSelectedImage(null)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Seat Selection Dialog */}
      <Dialog open={showSeatSelection} onOpenChange={setShowSeatSelection}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chọn ghế</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-6">
            <div className="flex items-center gap-4">
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
                <div className="h-4 w-4 bg-gray-200 opacity-50 rounded-full" />
                <span>Không sử dụng</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-green-500" />
                <span>Đã chọn</span>
              </div>
            </div>

            <div className="flex justify-center">
              <div 
                className="grid gap-2" 
                style={{ 
                  gridTemplateColumns: `repeat(${room?.numberSeatsOfRow || 0}, minmax(0, 1fr))`,
                  maxWidth: '100%',
                  overflowX: 'auto'
                }}
              >
                {seats.map((seat) => (
                  <button
                    key={seat.id}
                    className={`h-8 w-8 rounded flex items-center justify-center text-xs font-medium ${getSeatColor(seat)}`}
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.isBooked || seat.status === "Blocked"}
                  >
                    {seat.id}
                  </button>
                ))}
              </div>
            </div>

            {selectedSeats.length > 0 && (
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Ghế đã chọn:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map(seat => (
                      <Badge key={seat.id} variant="secondary">
                        Ghế {seat.id} - {seat.category}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Tổng số ghế: {selectedSeats.length}</p>
                      <p className="text-lg font-semibold">Tổng tiền: {calculateTotalPrice().toLocaleString('vi-VN')}đ</p>
                    </div>
                    <Button onClick={handlePayment}>
                      Tiếp tục thanh toán
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
