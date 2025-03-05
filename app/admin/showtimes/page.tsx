"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, Calendar, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

export default function AdminShowtimesPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roomFilter, setRoomFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  // Dữ liệu mẫu cho xuất chiếu
  const showtimes = [
    {
      id: 1,
      playId: 1,
      playTitle: "Lôi Vũ",
      roomId: 1,
      roomName: "Sân khấu chính",
      date: "2023-06-20",
      time: "19:30",
      status: "scheduled",
      ticketPrices: {
        vip: 500000,
        standard: 300000,
        economy: 200000,
      },
      ticketsSold: 120,
      totalSeats: 500,
      revenue: 45000000,
      createdDate: "15/06/2023",
    },
    {
      id: 2,
      playId: 2,
      playTitle: "Romeo và Juliet",
      roomId: 1,
      roomName: "Sân khấu chính",
      date: "2023-06-22",
      time: "20:00",
      status: "scheduled",
      ticketPrices: {
        vip: 600000,
        standard: 350000,
        economy: 250000,
      },
      ticketsSold: 85,
      totalSeats: 500,
      revenue: 28750000,
      createdDate: "16/06/2023",
    },
    {
      id: 3,
      playId: 1,
      playTitle: "Lôi Vũ",
      roomId: 2,
      roomName: "Sân khấu nhỏ",
      date: "2023-06-25",
      time: "19:00",
      status: "scheduled",
      ticketPrices: {
        vip: 400000,
        standard: 250000,
        economy: 150000,
      },
      ticketsSold: 95,
      totalSeats: 150,
      revenue: 21250000,
      createdDate: "17/06/2023",
    },
    {
      id: 4,
      playId: 3,
      playTitle: "Người Đàn Bà Điên",
      roomId: 2,
      roomName: "Sân khấu nhỏ",
      date: "2023-06-18",
      time: "20:30",
      status: "completed",
      ticketPrices: {
        vip: 450000,
        standard: 280000,
        economy: 180000,
      },
      ticketsSold: 140,
      totalSeats: 150,
      revenue: 35200000,
      createdDate: "10/06/2023",
    },
    {
      id: 5,
      playId: 2,
      playTitle: "Romeo và Juliet",
      roomId: 3,
      roomName: "Sân khấu ngoài trời",
      date: "2023-06-30",
      time: "19:30",
      status: "cancelled",
      ticketPrices: {
        vip: 550000,
        standard: 320000,
        economy: 220000,
      },
      ticketsSold: 0,
      totalSeats: 800,
      revenue: 0,
      createdDate: "20/06/2023",
    },
  ]

  const filteredShowtimes = showtimes.filter((showtime) => {
    const matchesSearch =
      showtime.playTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      showtime.roomName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || showtime.status === statusFilter
    const matchesRoom = roomFilter === "all" || showtime.roomId.toString() === roomFilter

    let matchesDate = true
    if (dateFilter === "today") {
      const today = new Date().toISOString().split("T")[0]
      matchesDate = showtime.date === today
    } else if (dateFilter === "week") {
      const today = new Date()
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      const showtimeDate = new Date(showtime.date)
      matchesDate = showtimeDate >= today && showtimeDate <= weekFromNow
    }

    return matchesSearch && matchesStatus && matchesRoom && matchesDate
  })

  const handleDeleteShowtime = (id: number, playTitle: string) => {
    toast({
      title: "Đã xóa xuất chiếu",
      description: `Xuất chiếu "${playTitle}" đã được xóa thành công`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-500">Đã lên lịch</Badge>
      case "ongoing":
        return <Badge className="bg-green-500">Đang diễn</Badge>
      case "completed":
        return <Badge className="bg-gray-500">Đã kết thúc</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Đã hủy</Badge>
      default:
        return <Badge>Không xác định</Badge>
    }
  }

  // Thống kê
  const totalShowtimes = showtimes.length
  const scheduledShowtimes = showtimes.filter((s) => s.status === "scheduled").length
  const totalRevenue = showtimes.reduce((sum, s) => sum + s.revenue, 0)
  const totalTicketsSold = showtimes.reduce((sum, s) => sum + s.ticketsSold, 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý xuất chiếu</h1>
        <Link href="/admin/showtimes/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo xuất chiếu mới
          </Button>
        </Link>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng xuất chiếu</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShowtimes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã lên lịch</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{scheduledShowtimes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vé đã bán</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTicketsSold.toLocaleString()}</div>
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
          <CardTitle>Danh sách xuất chiếu</CardTitle>
          <CardDescription>Quản lý tất cả xuất chiếu trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm xuất chiếu..."
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
                <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                <SelectItem value="ongoing">Đang diễn</SelectItem>
                <SelectItem value="completed">Đã kết thúc</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roomFilter} onValueChange={setRoomFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Phòng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phòng</SelectItem>
                <SelectItem value="1">Sân khấu chính</SelectItem>
                <SelectItem value="2">Sân khấu nhỏ</SelectItem>
                <SelectItem value="3">Sân khấu ngoài trời</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="week">Tuần này</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vở kịch</TableHead>
                  <TableHead>Phòng</TableHead>
                  <TableHead>Ngày giờ</TableHead>
                  <TableHead>Giá vé</TableHead>
                  <TableHead>Vé bán/Tổng</TableHead>
                  <TableHead>Doanh thu</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShowtimes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Không tìm thấy xuất chiếu nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredShowtimes.map((showtime) => (
                    <TableRow key={showtime.id}>
                      <TableCell>
                        <div className="font-medium">{showtime.playTitle}</div>
                      </TableCell>
                      <TableCell>{showtime.roomName}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{showtime.date}</div>
                          <div className="text-sm text-muted-foreground">{showtime.time}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>VIP: {showtime.ticketPrices.vip.toLocaleString()}đ</div>
                          <div>Thường: {showtime.ticketPrices.standard.toLocaleString()}đ</div>
                          <div>Tiết kiệm: {showtime.ticketPrices.economy.toLocaleString()}đ</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {showtime.ticketsSold}/{showtime.totalSeats}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {Math.round((showtime.ticketsSold / showtime.totalSeats) * 100)}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{showtime.revenue.toLocaleString()}đ</TableCell>
                      <TableCell>{getStatusBadge(showtime.status)}</TableCell>
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
                            <DropdownMenuItem>
                              <Link href={`/admin/showtimes/${showtime.id}`} className="flex w-full items-center">
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link href={`/admin/showtimes/${showtime.id}/edit`} className="flex w-full items-center">
                                <Edit className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Xóa xuất chiếu
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Xác nhận xóa xuất chiếu</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bạn có chắc chắn muốn xóa xuất chiếu "{showtime.playTitle}" vào {showtime.date}{" "}
                                    {showtime.time}? Hành động này không thể hoàn tác.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteShowtime(showtime.id, showtime.playTitle)}
                                  >
                                    Xóa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
            Hiển thị {filteredShowtimes.length} trên tổng số {showtimes.length} xuất chiếu
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
    </div>
  )
}
