"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { showtimesApi, Showtime, GetShowtimesResponse } from "@/lib/api/showtimes"
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

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
  const [showtimes, setShowtimes] = useState<Showtime[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roomFilter, setRoomFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10) // Adjust page size as needed
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [hasPreviousPage, setHasPreviousPage] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchShowtimes()
    }, 500) // Debounce search for 500ms

    return () => clearTimeout(timer)
  }, [currentPage, searchTerm, dateFilter]) // Add dateFilter to dependencies

  const fetchShowtimes = async () => {
    setIsLoading(true)
    try {
      const today = new Date()
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay()) // Set to start of week (Sunday)
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6) // Set to end of week (Saturday)
      
      let startTimeFrom = undefined
      let startTimeTo = undefined
      if (dateFilter === "today") {
        // Set to start of today (00:00:00)
        const startOfDay = new Date(today)
        startOfDay.setHours(0, 0, 0, 0)
        // Set to start of tomorrow (00:00:00)
        const startOfTomorrow = new Date(today)
        startOfTomorrow.setDate(today.getDate() + 1)
        startOfTomorrow.setHours(0, 0, 0, 0)
        
        startTimeFrom = startOfDay.toISOString()
        startTimeTo = startOfTomorrow.toISOString()
      } else if (dateFilter === "week") {
        // Set to start of week (00:00:00)
        startOfWeek.setHours(0, 0, 0, 0)
        // Set to start of next week (00:00:00)
        endOfWeek.setHours(23, 59, 59, 999)
        
        startTimeFrom = startOfWeek.toISOString()
        startTimeTo = endOfWeek.toISOString()
      }

      const response: GetShowtimesResponse = await showtimesApi.getShowtimes({
        pageIndex: currentPage,
        pageSize,
        EventName: searchTerm,
        StartTimeFrom: startTimeFrom,
        StartTimeTo: startTimeTo,
      })
      setShowtimes(response.contends)
      setTotalPages(response.totalPages)
      setTotalItems(response.totalItems)
      setHasPreviousPage(response.hasPreviousPage)
      setHasNextPage(response.hasNextPage)
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Đã xảy ra lỗi khi tải danh sách xuất chiếu",
        variant: "destructive",
      })
      setShowtimes([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteShowtime = async (id: number) => {
    try {
      await showtimesApi.deleteShowtime(id)
      toast({
        title: "Thành công",
        description: "Đã xóa xuất chiếu",
      })
      fetchShowtimes() // Refresh list after deletion
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Đã xảy ra lỗi khi xóa xuất chiếu",
        variant: "destructive",
      })
    }
  }

  const formatDateTime = (isoString: string) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid Date';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý xuất chiếu</h1>
        <Link href="/admin/showtimes/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm xuất chiếu mới
          </Button>
        </Link>
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
            {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
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
            </Select> */}
            {/* <Select value={roomFilter} onValueChange={setRoomFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Phòng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phòng</SelectItem>
                <SelectItem value="1">Sân khấu chính</SelectItem>
                <SelectItem value="2">Sân khấu nhỏ</SelectItem>
                <SelectItem value="3">Sân khấu ngoài trời</SelectItem>
              </SelectContent>
            </Select> */}
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
                  <TableHead>Sự kiện</TableHead>
                  <TableHead>Phòng</TableHead>
                  <TableHead>Thời gian bắt đầu</TableHead>
                  <TableHead>Giá VIP</TableHead>
                  <TableHead>Giá Thường</TableHead>
                  <TableHead>Giá Tiết kiệm</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : showtimes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Không tìm thấy xuất chiếu nào
                    </TableCell>
                  </TableRow>
                ) : (
                  showtimes.map((showtime) => (
                    <TableRow key={showtime.id}>
                      <TableCell>{showtime.event?.name || 'N/A'}</TableCell>
                      <TableCell>{showtime.room?.name || 'N/A'}</TableCell>
                      <TableCell>{formatDateTime(showtime.startTime)}</TableCell>
                      <TableCell>{showtime.priceVip.toLocaleString()} VNĐ</TableCell>
                      <TableCell>{showtime.priceNormal.toLocaleString()} VNĐ</TableCell>
                      <TableCell>{showtime.priceEconomy.toLocaleString()} VNĐ</TableCell>
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
                                    Bạn có chắc chắn muốn xóa xuất chiếu này không? Hành động này không thể hoàn tác.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteShowtime(showtime.id)}>
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
            Hiển thị {showtimes.length} trên tổng số {totalItems} xuất chiếu
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!hasPreviousPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Trang {currentPage} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!hasNextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
