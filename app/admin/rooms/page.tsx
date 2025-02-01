"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, MapPin } from "lucide-react"
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

export default function AdminRoomsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  // Dữ liệu mẫu cho phòng
  const rooms = [
    {
      id: 1,
      name: "Sân khấu chính",
      type: "theater",
      capacity: 500,
      status: "active",
      description: "Sân khấu lớn nhất với âm thanh và ánh sáng hiện đại",
      location: "Tầng 1",
      facilities: ["Âm thanh 5.1", "Màn hình LED", "Điều hòa", "Wifi"],
      totalSeats: {
        vip: 50,
        standard: 200,
        economy: 250,
      },
      createdDate: "15/01/2023",
      lastUpdated: "20/06/2023",
    },
    {
      id: 2,
      name: "Sân khấu nhỏ",
      type: "studio",
      capacity: 150,
      status: "active",
      description: "Sân khấu nhỏ phù hợp cho các buổi biểu diễn thân mật",
      location: "Tầng 2",
      facilities: ["Âm thanh cơ bản", "Ánh sáng sân khấu", "Điều hòa"],
      totalSeats: {
        vip: 20,
        standard: 80,
        economy: 50,
      },
      createdDate: "20/02/2023",
      lastUpdated: "15/06/2023",
    },
    {
      id: 3,
      name: "Sân khấu ngoài trời",
      type: "outdoor",
      capacity: 800,
      status: "active",
      description: "Không gian mở cho các sự kiện lớn",
      location: "Sân vườn",
      facilities: ["Âm thanh ngoài trời", "Màn hình lớn", "Hệ thống thoát nước"],
      totalSeats: {
        vip: 100,
        standard: 300,
        economy: 400,
      },
      createdDate: "10/03/2023",
      lastUpdated: "18/06/2023",
    },
    {
      id: 4,
      name: "Hội trường",
      type: "conference",
      capacity: 200,
      status: "maintenance",
      description: "Phòng hội nghị đa năng",
      location: "Tầng 3",
      facilities: ["Projector", "Âm thanh hội nghị", "Wifi", "Điều hòa"],
      totalSeats: {
        vip: 30,
        standard: 120,
        economy: 50,
      },
      createdDate: "05/04/2023",
      lastUpdated: "22/06/2023",
    },
    {
      id: 5,
      name: "Phòng VIP",
      type: "vip",
      capacity: 50,
      status: "inactive",
      description: "Phòng riêng cho khách VIP",
      location: "Tầng 4",
      facilities: ["Âm thanh cao cấp", "Ghế da", "Minibar", "Wifi"],
      totalSeats: {
        vip: 50,
        standard: 0,
        economy: 0,
      },
      createdDate: "01/05/2023",
      lastUpdated: "10/06/2023",
    },
  ]

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || room.status === statusFilter
    const matchesType = typeFilter === "all" || room.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const handleDeleteRoom = (id: number, name: string) => {
    toast({
      title: "Đã xóa phòng",
      description: `Phòng "${name}" đã được xóa thành công`,
    })
  }

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

  // Thống kê
  const totalRooms = rooms.length
  const activeRooms = rooms.filter((r) => r.status === "active").length
  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0)
  const totalSeats = rooms.reduce((sum, r) => sum + r.totalSeats.vip + r.totalSeats.standard + r.totalSeats.economy, 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý phòng</h1>
        <Link href="/admin/rooms/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm phòng mới
          </Button>
        </Link>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số phòng</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRooms}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phòng hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeRooms}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sức chứa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCapacity.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số ghế</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSeats.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách phòng</CardTitle>
          <CardDescription>Quản lý tất cả phòng trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm phòng..."
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
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
                <SelectItem value="maintenance">Bảo trì</SelectItem>
                <SelectItem value="closed">Đóng cửa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Loại phòng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="theater">Sân khấu</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="outdoor">Ngoài trời</SelectItem>
                <SelectItem value="conference">Hội trường</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên phòng</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead>Sức chứa</TableHead>
                  <TableHead>Số ghế</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Cập nhật</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Không tìm thấy phòng nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{room.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">{room.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeText(room.type)}</TableCell>
                      <TableCell>{room.location}</TableCell>
                      <TableCell>{room.capacity} người</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>VIP: {room.totalSeats.vip}</div>
                          <div>Thường: {room.totalSeats.standard}</div>
                          <div>Tiết kiệm: {room.totalSeats.economy}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(room.status)}</TableCell>
                      <TableCell>{room.lastUpdated}</TableCell>
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
                              <Link href={`/admin/rooms/${room.id}`} className="flex w-full items-center">
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link href={`/admin/rooms/${room.id}/edit`} className="flex w-full items-center">
                                <Edit className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link href={`/admin/rooms/${room.id}/seats`} className="flex w-full items-center">
                                <MapPin className="mr-2 h-4 w-4" />
                                Quản lý ghế
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Xóa phòng
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Xác nhận xóa phòng</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bạn có chắc chắn muốn xóa phòng "{room.name}"? Hành động này không thể hoàn tác.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteRoom(room.id, room.name)}>
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
            Hiển thị {filteredRooms.length} trên tổng số {rooms.length} phòng
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
