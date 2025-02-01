"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, MapPin, Users, Calendar, Settings } from "lucide-react"

export default function RoomDetailPage({ params }: { params: { id: string } }) {
  // Dữ liệu mẫu cho phòng
  const room = {
    id: Number.parseInt(params.id),
    name: "Sân khấu chính",
    type: "theater",
    capacity: 500,
    status: "active",
    description: "Sân khấu lớn nhất với âm thanh và ánh sáng hiện đại, phù hợp cho các buổi biểu diễn lớn",
    location: "Tầng 1",
    facilities: ["Âm thanh 5.1", "Màn hình LED", "Điều hòa", "Wifi", "Ánh sáng sân khấu"],
    totalSeats: {
      vip: 50,
      standard: 200,
      economy: 250,
    },
    createdDate: "15/01/2023",
    lastUpdated: "20/06/2023",
    dimensions: {
      length: 30,
      width: 25,
      height: 8,
    },
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
  }

  // Dữ liệu mẫu cho sự kiện sắp tới
  const upcomingEvents = [
    {
      id: 1,
      title: "Vở Kịch: Lôi Vũ",
      date: "20/06/2023",
      time: "19:30",
      ticketsSold: 420,
      totalTickets: 500,
    },
    {
      id: 2,
      title: "Hòa Nhạc Mùa Hè",
      date: "25/06/2023",
      time: "20:00",
      ticketsSold: 350,
      totalTickets: 500,
    },
    {
      id: 3,
      title: "Múa Ballet: Hồ Thiên Nga",
      date: "30/06/2023",
      time: "19:00",
      ticketsSold: 280,
      totalTickets: 500,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Hoạt động</Badge>
      case "inactive":
        return <Badge className="bg-gray-500">Không hoạt động</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-500">Bảo trì</Badge>
      case "closed":
        return <Badge className="bg-red-500">Đóng cửa</Badge>
      default:
        return <Badge>Không xác định</Badge>
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "theater":
        return "Sân khấu"
      case "studio":
        return "Studio"
      case "outdoor":
        return "Ngoài trời"
      case "conference":
        return "Hội trường"
      case "vip":
        return "VIP"
      default:
        return "Khác"
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/rooms">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{room.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge(room.status)}
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{getTypeText(room.type)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/rooms/${room.id}/seats`}>
            <Button variant="outline">
              <MapPin className="mr-2 h-4 w-4" />
              Quản lý ghế
            </Button>
          </Link>
          <Link href={`/admin/rooms/${room.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          </Link>
        </div>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sức chứa</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{room.capacity}</div>
            <p className="text-xs text-muted-foreground">người</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số ghế</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {room.totalSeats.vip + room.totalSeats.standard + room.totalSeats.economy}
            </div>
            <p className="text-xs text-muted-foreground">ghế</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sự kiện sắp tới</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground">sự kiện</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiện nghi</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{room.facilities.length}</div>
            <p className="text-xs text-muted-foreground">tiện nghi</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="events">Sự kiện</TabsTrigger>
              <TabsTrigger value="gallery">Hình ảnh</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin phòng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Mô tả</h3>
                    <p className="text-muted-foreground">{room.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">Vị trí</h3>
                      <p className="text-muted-foreground">{room.location}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Kích thước</h3>
                      <p className="text-muted-foreground">
                        {room.dimensions.length}m × {room.dimensions.width}m × {room.dimensions.height}m
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Tiện nghi</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {room.facilities.map((facility, index) => (
                        <Badge key={index} variant="outline">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="events" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sự kiện sắp tới</CardTitle>
                  <CardDescription>Danh sách các sự kiện sẽ diễn ra tại phòng này</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {event.date} - {event.time}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {event.ticketsSold}/{event.totalTickets}
                          </p>
                          <p className="text-sm text-muted-foreground">vé đã bán</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="gallery" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Hình ảnh phòng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {room.images.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`${room.name} - Hình ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chi tiết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Vị trí</p>
                  <p className="text-sm text-gray-500">{room.location}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Sức chứa</p>
                  <p className="text-sm text-gray-500">{room.capacity} người</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Ngày tạo</p>
                  <p className="text-sm text-gray-500">{room.createdDate}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Settings className="mr-2 h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Cập nhật cuối</p>
                  <p className="text-sm text-gray-500">{room.lastUpdated}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phân bố ghế</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>VIP</span>
                <span className="font-medium">{room.totalSeats.vip} ghế</span>
              </div>
              <div className="flex justify-between">
                <span>Thường</span>
                <span className="font-medium">{room.totalSeats.standard} ghế</span>
              </div>
              <div className="flex justify-between">
                <span>Tiết kiệm</span>
                <span className="font-medium">{room.totalSeats.economy} ghế</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Tổng cộng</span>
                  <span>{room.totalSeats.vip + room.totalSeats.standard + room.totalSeats.economy} ghế</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
