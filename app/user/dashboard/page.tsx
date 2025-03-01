"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, MapPin, Clock, Ticket } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { UserNav } from "@/components/user/user-nav"

export default function UserDashboardPage() {
  // Dữ liệu mẫu cho vé đã mua
  const tickets = [
    {
      id: 1,
      eventId: 1,
      eventTitle: "Vở Kịch: Lôi Vũ",
      date: "20/06/2023",
      time: "19:30",
      location: "Sân khấu chính",
      seats: ["VIP-5", "VIP-6"],
      status: "upcoming",
      image: "https://nld.mediacdn.vn/2020/3/2/13-kich-15831592557842103318677.jpg",
    },
    {
      id: 2,
      eventId: 3,
      eventTitle: "Múa Ballet: Hồ Thiên Nga",
      date: "30/06/2023",
      time: "19:00",
      location: "Sân khấu chính",
      seats: ["STD-15"],
      status: "upcoming",
      image: "https://nld.mediacdn.vn/2020/3/2/13-kich-15831592557842103318677.jpg",
    },
    {
      id: 3,
      eventId: 6,
      eventTitle: "Xiếc: Đêm Kỳ Diệu",
      date: "15/05/2023",
      time: "18:00",
      location: "Sân khấu chính",
      seats: ["ECO-22", "ECO-23", "ECO-24"],
      status: "completed",
      image: "https://nld.mediacdn.vn/2020/3/2/13-kich-15831592557842103318677.jpg",
    },
  ]

  // Dữ liệu mẫu cho sự kiện đề xuất
  const recommendedEvents = [
    {
      id: 2,
      title: "Hòa Nhạc Mùa Hè",
      description: "Đêm nhạc cổ điển với những tác phẩm nổi tiếng",
      date: "25/06/2023",
      time: "20:00",
      location: "Sân khấu ngoài trời",
      category: "Âm nhạc",
      image: "https://nld.mediacdn.vn/2020/3/2/13-kich-15831592557842103318677.jpg",
    },
    {
      id: 4,
      title: "Kịch: Người Đàn Bà Điên",
      description: "Vở kịch tâm lý sâu sắc về số phận con người",
      date: "05/07/2023",
      time: "19:30",
      location: "Sân khấu nhỏ",
      category: "Kịch",
      image: "https://nld.mediacdn.vn/2020/3/2/13-kich-15831592557842103318677.jpg",
    },
    {
      id: 5,
      title: "Đêm Nhạc Jazz",
      description: "Đêm nhạc jazz với những nghệ sĩ hàng đầu",
      date: "10/07/2023",
      time: "20:30",
      location: "Sân khấu ngoài trời",
      category: "Âm nhạc",
      image: "https://nld.mediacdn.vn/2020/3/2/13-kich-15831592557842103318677.jpg",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-500">Sắp diễn ra</Badge>
      case "ongoing":
        return <Badge className="bg-green-500">Đang diễn ra</Badge>
      case "completed":
        return <Badge className="bg-gray-500">Đã kết thúc</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Đã hủy</Badge>
      default:
        return <Badge>Không xác định</Badge>
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container-custom flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold">Nhà Hát Kịch</span>
          </Link>
          <UserNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-3xl font-bold">Xin chào, Nguyễn Văn A</h1>
              <p className="text-muted-foreground">Chào mừng bạn quay trở lại với Nhà Hát Kịch</p>
            </div>
            <Tabs defaultValue="tickets" className="space-y-4">
              <TabsList>
                <TabsTrigger value="tickets">Vé của tôi</TabsTrigger>
                <TabsTrigger value="recommended">Đề xuất cho bạn</TabsTrigger>
              </TabsList>
              <TabsContent value="tickets" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {tickets.map((ticket) => (
                    <Card key={ticket.id} className="overflow-hidden">
                      <img
                        src={ticket.image || "/placeholder.svg"}
                        alt={ticket.eventTitle}
                        className="aspect-video w-full object-cover"
                      />
                      <CardHeader>
                        <div className="flex items-center justify-between">{getStatusBadge(ticket.status)}</div>
                        <CardTitle className="line-clamp-1">{ticket.eventTitle}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col space-y-2 text-sm">
                          <div className="flex items-center">
                            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                            <span>{ticket.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 opacity-70" />
                            <span>{ticket.time}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 opacity-70" />
                            <span>{ticket.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Ticket className="mr-2 h-4 w-4 opacity-70" />
                            <span>Ghế: {ticket.seats.join(", ")}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link href={`/user/tickets/${ticket.id}`} className="w-full">
                          <Button className="w-full">Xem chi tiết</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                {tickets.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <h3 className="mt-2 text-lg font-semibold">Bạn chưa có vé nào</h3>
                    <p className="mb-4 mt-1 text-sm text-muted-foreground">Hãy đặt vé cho các sự kiện sắp diễn ra</p>
                    <Link href="/events">
                      <Button>Khám phá sự kiện</Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="recommended" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {recommendedEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="aspect-video w-full object-cover"
                      />
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge>{event.category}</Badge>
                        </div>
                        <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col space-y-2 text-sm">
                          <div className="flex items-center">
                            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 opacity-70" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 opacity-70" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link href={`/events/${event.id}`} className="w-full">
                          <Button className="w-full">Đặt vé</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
