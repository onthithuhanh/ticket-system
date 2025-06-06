"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2, MapPin } from "lucide-react"
import { roomsApi, Room, RoomCategory, RoomStatus } from "@/lib/api/rooms"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
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

const PAGE_SIZE = 5

export interface GetRoomsParams {
  Search?: string
  Status?: RoomStatus
  Category?: RoomCategory 
  PageIndex: number
  PageSize: number
}

export default function RoomsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [rooms, setRooms] = useState<Room[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [hasPreviousPage, setHasPreviousPage] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(5)

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRooms()
    }, 500) // Debounce search for 500ms

    return () => clearTimeout(timer)
  }, [currentPage, searchTerm, statusFilter, categoryFilter])

  const fetchRooms = async () => {
    try {
      setIsLoading(true)
      const response = await roomsApi.getRooms({
        Search: searchTerm,
        PageIndex: currentPage,
        PageSize: pageSize,
        Status: statusFilter === 'all' ? undefined : statusFilter as RoomStatus,
        Category: categoryFilter === 'all' ? undefined : categoryFilter as RoomCategory,
        SortColumn: "createdAt",
        SortDir: "Desc"
      })
      setRooms(response.contends)
      setTotalPages(response.totalPages)
      setTotalItems(response.totalItems)
      setHasPreviousPage(response.hasPreviousPage)
      setHasNextPage(response.hasNextPage)
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể tải danh sách phòng",
        variant: "destructive",
      })
      setRooms([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page)
  }

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.Active:
        return "bg-green-500"
      case RoomStatus.Inactive:
        return "bg-gray-500"
      case RoomStatus.Maintenance:
        return "bg-yellow-500"
      case RoomStatus.Closed:
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.Active:
        return "Hoạt động"
      case RoomStatus.Inactive:
        return "Không hoạt động"
      case RoomStatus.Maintenance:
        return "Bảo trì"
      case RoomStatus.Closed:
        return "Đóng cửa"
      default:
        return status
    }
  }

  const getCategoryLabel = (category: RoomCategory) => {
    switch (category) {
      case RoomCategory.Stage:
        return "Sân khấu"
      case RoomCategory.Studio:
        return "Studio"
      case RoomCategory.Outdoor:
        return "Ngoài trời"
      case RoomCategory.Hall:
        return "Hội trường"
      case RoomCategory.Vip:
        return "VIP"
      default:
        return category
    }
  }

  const handleDeleteRoom = async (id: number, name: string) => {
    try {
      await roomsApi.deleteRoom(id)
      toast({
        title: "Thành công",
        description: `Đã xóa phòng "${name}"`,
      })
      fetchRooms() // Refresh the room list after deletion
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Đã xảy ra lỗi khi xóa phòng",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý phòng</h1>
          <p className="text-muted-foreground">Danh sách phòng và trạng thái</p>
        </div>
        <Link href="/admin/rooms/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo phòng mới
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm và lọc</CardTitle>
          <CardDescription>Tìm kiếm phòng theo tên, trạng thái hoặc loại phòng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm phòng..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value={RoomStatus.Active}>Hoạt động</SelectItem>
                <SelectItem value={RoomStatus.Inactive}>Không hoạt động</SelectItem>
                <SelectItem value={RoomStatus.Maintenance}>Bảo trì</SelectItem>
                <SelectItem value={RoomStatus.Closed}>Đóng cửa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Loại phòng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value={RoomCategory.Stage}>Sân khấu</SelectItem>
                <SelectItem value={RoomCategory.Studio}>Studio</SelectItem>
                <SelectItem value={RoomCategory.Outdoor}>Ngoài trời</SelectItem>
                <SelectItem value={RoomCategory.Hall}>Hội trường</SelectItem>
                <SelectItem value={RoomCategory.Vip}>VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách phòng</CardTitle>
          <CardDescription>Quản lý tất cả phòng trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên phòng</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead>Sức chứa</TableHead>
                  <TableHead>Kích thước</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Không tìm thấy phòng nào
                    </TableCell>
                  </TableRow>
                ) : (
                  rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{room.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">{room.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getCategoryLabel(room.category)}</TableCell>
                      <TableCell>{room.location}</TableCell>
                      <TableCell>{room.capacity} người</TableCell>
                      <TableCell>
                        {room.length}m x {room.width}m x {room.height}m
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(room.status)}>
                          {getStatusLabel(room.status)}
                        </Badge>
                      </TableCell>
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
                            {/* <DropdownMenuItem>
                              <Link href={`/admin/rooms/${room.id}/seats`} className="flex w-full items-center">
                                <MapPin className="mr-2 h-4 w-4" />
                                Quản lý ghế
                              </Link>
                            </DropdownMenuItem> */}
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
            Hiển thị {rooms.length} trên tổng số {totalItems} phòng
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPreviousPage}
            >
              Trước
            </Button>
            <div className="text-sm">
              Trang {currentPage} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNextPage}
            >
              Sau
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
