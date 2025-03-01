"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, Clock, Info } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [seatMap, setSeatMap] = useState<{
    vip: Array<{ id: string; status: string }>;
    standard: Array<{ id: string; status: string }>;
    economy: Array<{ id: string; status: string }>;
  }>({
    vip: [],
    standard: [],
    economy: []
  })

  // Unwrap the params using React.use()
  const unwrappedParams = use(params)

  // Khởi tạo dữ liệu ghế khi component mount
  useEffect(() => {
    const initialSeatMap = {
      vip: Array.from({ length: 20 }, (_, i) => ({
        id: `VIP-${i + 1}`,
        status: Math.random() > 0.3 ? "available" : "booked",
      })),
      standard: Array.from({ length: 40 }, (_, i) => ({
        id: `STD-${i + 1}`,
        status: Math.random() > 0.3 ? "available" : "booked",
      })),
      economy: Array.from({ length: 60 }, (_, i) => ({
        id: `ECO-${i + 1}`,
        status: Math.random() > 0.3 ? "available" : "booked",
      })),
    }
    setSeatMap(initialSeatMap)
  }, [])

  // Dữ liệu mẫu cho sự kiện
  const event = {
    id: Number.parseInt(unwrappedParams.id),
    title: "Vở Kịch: Lôi Vũ",
    description:
      "Một vở kịch cảm động về tình yêu và sự hy sinh trong thời chiến. Vở kịch kể về câu chuyện của một người lính và người yêu anh, họ phải đối mặt với những thử thách của chiến tranh và tình yêu.",
    longDescription:
      "Vở kịch Lôi Vũ là một tác phẩm nghệ thuật sâu sắc, kể về câu chuyện tình yêu đầy cảm động giữa người lính Lôi và cô gái làng Vũ. Trong bối cảnh chiến tranh khốc liệt, họ phải đối mặt với nhiều thử thách, hy sinh và đau thương. Vở kịch không chỉ là câu chuyện tình yêu mà còn là bức tranh về lòng yêu nước, tinh thần dũng cảm và sự hy sinh cao cả của con người trong thời chiến. Với sự tham gia của các diễn viên hàng đầu, âm nhạc sống động và bối cảnh chân thực, Lôi Vũ hứa hẹn sẽ mang đến cho khán giả những trải nghiệm nghệ thuật đáng nhớ.",
    date: "20/06/2023",
    time: "19:30",
    duration: "120 phút",
    location: "Sân khấu chính",
    category: "Kịch",
    director: "Nguyễn Văn A",
    cast: ["Trần Thị B", "Lê Văn C", "Phạm Thị D"],
    price: {
      vip: 500000,
      standard: 300000,
      economy: 200000,
    },
    image: "https://skda.edu.vn/wp-content/uploads/3-170.jpg",
    gallery: [
      "https://nld.mediacdn.vn/2020/3/2/13-kich-15831592557842103318677.jpg",
      "https://nld.mediacdn.vn/2020/3/2/13-kich-15831592557842103318677.jpg",
      "https://nld.mediacdn.vn/2020/3/2/13-kich-15831592557842103318677.jpg",
    ],
  }

  const handleSeatClick = (seatId: string) => {
    // Xác định loại ghế từ ID
    let seatType: 'vip' | 'standard' | 'economy';
    if (seatId.startsWith('VIP')) {
      seatType = 'vip';
    } else if (seatId.startsWith('STD')) {
      seatType = 'standard';
    } else if (seatId.startsWith('ECO')) {
      seatType = 'economy';
    } else {
      return; // Nếu không phải loại ghế hợp lệ
    }

    // Tìm ghế trong mảng tương ứng
    const seat = seatMap[seatType].find(s => s.id === seatId);
    
    if (!seat || seat.status === "booked") {
      return;
    }

    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  }

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "Vui lòng chọn ghế",
        description: "Bạn cần chọn ít nhất một ghế để đặt vé",
        variant: "destructive",
      })
      return
    }
    setIsBookingModalOpen(true)
  }

  const handleConfirmBooking = () => {
    setIsProcessing(true)
    // Giả lập xử lý đặt vé
    setTimeout(() => {
      setIsProcessing(false)
      setIsBookingModalOpen(false)
      toast({
        title: "Đặt vé thành công",
        description: `Bạn đã đặt ${selectedSeats.length} vé cho sự kiện ${event.title}`,
      })
      router.push("/user/tickets")
    }, 1500)
  }

  const calculateTotal = () => {
    let total = 0
    selectedSeats.forEach((seatId) => {
      if (seatId.startsWith("VIP")) {
        total += event.price.vip
      } else if (seatId.startsWith("STD")) {
        total += event.price.standard
      } else if (seatId.startsWith("ECO")) {
        total += event.price.economy
      }
    })
    return total
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container-custom flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="relative h-[400px] w-full">
          <img src={event.image || "/placeholder.svg"} alt={event.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <Badge className="mb-2">{event.category}</Badge>
            <h1 className="text-3xl font-bold text-black md:text-4xl">{event.title}</h1>
          </div>
        </div>

        <section className="container-custom py-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <Tabs defaultValue="info">
                <TabsList className="w-full">
                  <TabsTrigger value="info" className="flex-1">
                    Thông tin
                  </TabsTrigger>
                  <TabsTrigger value="seats" className="flex-1">
                    Chọn ghế
                  </TabsTrigger>
                  <TabsTrigger value="gallery" className="flex-1">
                    Hình ảnh
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold">Mô tả</h2>
                      <p className="mt-2 text-gray-700">{event.longDescription}</p>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Đạo diễn</h2>
                      <p className="mt-2 text-gray-700">{event.director}</p>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Diễn viên</h2>
                      <ul className="mt-2 list-inside list-disc text-gray-700">
                        {event.cast.map((actor, index) => (
                          <li key={index}>{actor}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="seats" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold">Sơ đồ chỗ ngồi</h2>
                      <p className="mt-2 text-gray-700">
                        Chọn ghế bạn muốn đặt. Ghế màu xanh là ghế có sẵn, ghế màu xám là ghế đã được đặt.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold">Khu VIP - {event.price.vip.toLocaleString()}đ/ghế</h3>
                        <div className="mt-2 grid grid-cols-10 gap-2">
                          {seatMap.vip.map((seat) => (
                            <button
                              key={seat.id}
                              disabled={seat.status === "booked"}
                              className={`h-10 rounded-md text-xs font-medium transition-colors ${
                                seat.status === "booked"
                                  ? "cursor-not-allowed bg-gray-200 text-gray-400"
                                  : selectedSeats.includes(seat.id)
                                    ? "bg-green-500 text-white hover:bg-green-600"
                                    : "bg-blue-500 text-white hover:bg-blue-600"
                              }`}
                              onClick={() => handleSeatClick(seat.id)}
                            >
                              {seat.id}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Khu Standard - {event.price.standard.toLocaleString()}đ/ghế</h3>
                        <div className="mt-2 grid grid-cols-10 gap-2">
                          {seatMap.standard.map((seat) => (
                            <button
                              key={seat.id}
                              disabled={seat.status === "booked"}
                              className={`h-10 rounded-md text-xs font-medium transition-colors ${
                                seat.status === "booked"
                                  ? "cursor-not-allowed bg-gray-200 text-gray-400"
                                  : selectedSeats.includes(seat.id)
                                    ? "bg-green-500 text-white hover:bg-green-600"
                                    : "bg-blue-500 text-white hover:bg-blue-600"
                              }`}
                              onClick={() => handleSeatClick(seat.id)}
                            >
                              {seat.id}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Khu Economy - {event.price.economy.toLocaleString()}đ/ghế</h3>
                        <div className="mt-2 grid grid-cols-10 gap-2">
                          {seatMap.economy.map((seat) => (
                            <button
                              key={seat.id}
                              disabled={seat.status === "booked"}
                              className={`h-10 rounded-md text-xs font-medium transition-colors ${
                                seat.status === "booked"
                                  ? "cursor-not-allowed bg-gray-200 text-gray-400"
                                  : selectedSeats.includes(seat.id)
                                    ? "bg-green-500 text-white hover:bg-green-600"
                                    : "bg-blue-500 text-white hover:bg-blue-600"
                              }`}
                              onClick={() => handleSeatClick(seat.id)}
                            >
                              {seat.id}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                          <span className="text-sm">Ghế trống</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-green-500"></div>
                          <span className="text-sm">Ghế đã chọn</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-gray-200"></div>
                          <span className="text-sm">Ghế đã đặt</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Button onClick={handleBooking} disabled={selectedSeats.length === 0} className="w-full">
                        {selectedSeats.length > 0
                          ? `Đặt ${selectedSeats.length} vé (${calculateTotal().toLocaleString()}đ)`
                          : "Chọn ghế để đặt vé"}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="gallery" className="mt-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {event.gallery.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`${event.title} - Hình ${index + 1}`}
                        className="h-auto w-full rounded-lg object-cover"
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-bold">Thông tin sự kiện</h2>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <CalendarDays className="mr-2 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Ngày</p>
                      <p className="text-sm text-gray-500">{event.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Thời gian</p>
                      <p className="text-sm text-gray-500">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Thời lượng</p>
                      <p className="text-sm text-gray-500">{event.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Địa điểm</p>
                      <p className="text-sm text-gray-500">{event.location}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <h3 className="font-semibold">Giá vé</h3>
                  <div className="flex justify-between">
                    <span>VIP</span>
                    <span>{event.price.vip.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thường</span>
                    <span>{event.price.standard.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tiết kiệm</span>
                    <span>{event.price.economy.toLocaleString()}đ</span>
                  </div>
                </div>
                <div className="mt-6">
                  <Button
                    onClick={() => {
                      const tabsList = document.querySelector('[role="tablist"]') as HTMLElement
                      const seatsTab = tabsList?.querySelector('[value="seats"]') as HTMLElement
                      seatsTab?.click()
                      window.scrollTo({
                        top: seatsTab.offsetTop - 100,
                        behavior: "smooth",
                      })
                    }}
                    className="w-full"
                  >
                    Đặt vé ngay
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Xác nhận đặt vé</DialogTitle>
              <DialogDescription>Vui lòng kiểm tra thông tin đặt vé của bạn</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="font-medium">{event.title}</h3>
                <div className="flex items-center text-sm">
                  <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />
                  <span>
                    {event.date} - {event.time}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                  <span>{event.location}</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Ghế đã chọn</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <Badge key={seat} variant="outline">
                      {seat}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Tổng tiền</h3>
                <p className="text-2xl font-bold">{calculateTotal().toLocaleString()}đ</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Phương thức thanh toán</h3>
                <Select defaultValue="card">
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phương thức thanh toán" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Thẻ tín dụng/ghi nợ</SelectItem>
                    <SelectItem value="banking">Chuyển khoản ngân hàng</SelectItem>
                    <SelectItem value="momo">Ví MoMo</SelectItem>
                    <SelectItem value="vnpay">VNPay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsBookingModalOpen(false)} disabled={isProcessing}>
                Hủy
              </Button>
              <Button onClick={handleConfirmBooking} disabled={isProcessing}>
                {isProcessing ? "Đang xử lý..." : "Xác nhận đặt vé"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  )
}
