"use client"

import { useState } from "react"
import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Edit, Trash2, CalendarDays, MapPin, Clock, Users, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Unwrap the params using React.use()
  const unwrappedParams = use(params)
  
  // Dữ liệu mẫu cho sự kiện
  const event = {
    id: Number.parseInt(unwrappedParams?.id),
    title: "Vở Kịch: Lôi Vũ",
    description: "Một vở kịch cảm động về tình yêu và sự hy sinh",
    longDescription:
      "Vở kịch Lôi Vũ là một tác phẩm nghệ thuật sâu sắc, kể về câu chuyện tình yêu đầy cảm động giữa người lính Lôi và cô gái làng Vũ. Trong bối cảnh chiến tranh khốc liệt, họ phải đối mặt với nhiều thử thách, hy sinh và đau thương.",
    date: "20/06/2023",
    time: "19:30",
    duration: "120 phút",
    location: "Sân khấu chính",
    category: "Kịch",
    status: "upcoming",
    director: "Nguyễn Văn A",
    cast: ["Trần Thị B", "Lê Văn C", "Phạm Thị D"],
    price: {
      vip: 500000,
      standard: 300000,
      economy: 200000,
    },
    seats: {
      vip: { total: 20, sold: 12, available: 8 },
      standard: { total: 40, sold: 25, available: 15 },
      economy: { total: 60, sold: 35, available: 25 },
    },
    revenue: 18500000,
    image: "https://skda.edu.vn/wp-content/uploads/3-170.jpg",
  }

  // Dữ liệu mẫu cho danh sách vé đã bán
  const soldTickets = [
    {
      id: 1,
      customerName: "Nguyễn Thị Hương",
      email: "huong.nguyen@example.com",
      seats: ["VIP-5", "VIP-6"],
      totalAmount: 1000000,
      purchaseDate: "15/06/2023",
      status: "confirmed",
    },
    {
      id: 2,
      customerName: "Trần Văn Lâm",
      email: "lam.tran@example.com",
      seats: ["STD-15"],
      totalAmount: 300000,
      purchaseDate: "16/06/2023",
      status: "confirmed",
    },
    {
      id: 3,
      customerName: "Phạm Minh Hiếu",
      email: "hieu.pham@example.com",
      seats: ["ECO-22", "ECO-23", "ECO-24"],
      totalAmount: 600000,
      purchaseDate: "17/06/2023",
      status: "confirmed",
    },
  ]

  const handleDeleteEvent = async () => {
    setIsDeleting(true)
    try {
      // Giả lập xóa sự kiện
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast({
        title: "Đã xóa sự kiện",
        description: "Sự kiện đã được xóa thành công",
      })
      // Redirect to events list
      window.location.href = "/admin/events"
    } catch (error) {
      toast({
        title: "Lỗi xóa sự kiện",
        description: "Đã xảy ra lỗi khi xóa sự kiện",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

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

  const getTicketStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Đã xác nhận</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Chờ xử lý</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Đã hủy</Badge>
      default:
        return <Badge>Không xác định</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/events">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge(event.status)}
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{event.category}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/events/${event.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa sự kiện</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa sự kiện "{event.title}"? Hành động này không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteEvent} disabled={isDeleting}>
                  {isDeleting ? "Đang xóa..." : "Xóa"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{event.revenue.toLocaleString()}đ</div>
            <p className="text-xs text-muted-foreground">
              {(
                ((event.seats.vip.sold + event.seats.standard.sold + event.seats.economy.sold) /
                  (event.seats.vip.total + event.seats.standard.total + event.seats.economy.total)) *
                100
              ).toFixed(1)}
              % vé đã bán
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vé đã bán</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {event.seats.vip.sold + event.seats.standard.sold + event.seats.economy.sold}
            </div>
            <p className="text-xs text-muted-foreground">
              Trên tổng số {event.seats.vip.total + event.seats.standard.total + event.seats.economy.total} ghế
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ghế còn lại</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {event.seats.vip.available + event.seats.standard.available + event.seats.economy.available}
            </div>
            <p className="text-xs text-muted-foreground">Ghế có thể đặt</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giá vé trung bình</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                event.revenue / (event.seats.vip.sold + event.seats.standard.sold + event.seats.economy.sold),
              ).toLocaleString()}
              đ
            </div>
            <p className="text-xs text-muted-foreground">Trên mỗi vé</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="tickets">Vé đã bán</TabsTrigger>
              <TabsTrigger value="seats">Sơ đồ ghế</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin sự kiện</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Mô tả</h3>
                    <p className="text-muted-foreground">{event.longDescription}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">Đạo diễn</h3>
                      <p className="text-muted-foreground">{event.director}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Diễn viên</h3>
                      <ul className="text-muted-foreground">
                        {event.cast.map((actor, index) => (
                          <li key={index}>• {actor}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tickets" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Danh sách vé đã bán</CardTitle>
                  <CardDescription>Tổng cộng {soldTickets.length} vé đã được bán</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Khách hàng</TableHead>
                        <TableHead>Ghế</TableHead>
                        <TableHead>Số tiền</TableHead>
                        <TableHead>Ngày mua</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {soldTickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{ticket.customerName}</div>
                              <div className="text-sm text-muted-foreground">{ticket.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{ticket.seats.join(", ")}</TableCell>
                          <TableCell>{ticket.totalAmount.toLocaleString()}đ</TableCell>
                          <TableCell>{ticket.purchaseDate}</TableCell>
                          <TableCell>{getTicketStatusBadge(ticket.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="seats" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Thống kê ghế</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{event.seats.vip.sold}</div>
                        <div className="text-sm text-muted-foreground">VIP đã bán</div>
                        <div className="text-xs text-muted-foreground">/{event.seats.vip.total} ghế</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{event.seats.standard.sold}</div>
                        <div className="text-sm text-muted-foreground">Thường đã bán</div>
                        <div className="text-xs text-muted-foreground">/{event.seats.standard.total} ghế</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{event.seats.economy.sold}</div>
                        <div className="text-sm text-muted-foreground">Tiết kiệm đã bán</div>
                        <div className="text-xs text-muted-foreground">/{event.seats.economy.total} ghế</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hình ảnh sự kiện</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin chi tiết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <CalendarDays className="mr-2 h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Ngày & Giờ</p>
                  <p className="text-sm text-gray-500">
                    {event.date} - {event.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-gray-500" />
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Giá vé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>VIP</span>
                <span className="font-medium">{event.price.vip.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between">
                <span>Thường</span>
                <span className="font-medium">{event.price.standard.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between">
                <span>Tiết kiệm</span>
                <span className="font-medium">{event.price.economy.toLocaleString()}đ</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
