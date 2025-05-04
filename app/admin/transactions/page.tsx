"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Eye, MoreHorizontal, DollarSign, CreditCard, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { api } from "@/lib/api" 
import { useDebounce } from "@/hooks/use-debounce"

interface Booking {
  id: string
  totalPrice: number
  status: "Success" | "Failed" | "Pending"
  method: "VnPay" | "Momo"
  createdAt: string
  user: {
    id: string
    userName: string
    email: string
    fullName: string
    phoneNumber?: string
  }
  schedule: {
    id: number
    startTime: string
    event: {
      id: number
      name: string
    }
  }
  tickets: Array<{
    id: number
    price: number
    qrCode: string
    isUsed: boolean
    seat: {
      id: number
      index: number
      category: string
    }
  }>
}

interface PaginatedResponse {
  page: number
  size: number
  totalPages: number
  totalItems: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  contends: Booking[]
}

export default function AdminTransactionsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all")
  const [selectedTransaction, setSelectedTransaction] = useState<Booking | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    fetchBookings()
  }, [currentPage, debouncedSearchTerm, statusFilter, paymentMethodFilter])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const fromDate = new Date()
      fromDate.setFullYear(2021)
      const toDate = new Date()
      toDate.setFullYear(2029)

      let url = `/Bookings?CreatedAtFrom=${fromDate.toISOString()}&CreatedAtTo=${toDate.toISOString()}&pageIndex=${currentPage}&pageSize=10`
      
      if (debouncedSearchTerm) {
        url += `&searchTerm=${encodeURIComponent(debouncedSearchTerm)}`
      }
      if (statusFilter !== 'all') {
        url += `&Status=${statusFilter}`
      }
      if (paymentMethodFilter !== 'all') {
        url += `&method=${paymentMethodFilter}`
      }

      const response = await api.get(url)
      setBookings(response.data.contends)
      setTotalPages(response.data.totalPages)
      setTotalItems(response.data.totalItems)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu giao dịch",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewTransaction = (booking: Booking) => {
    setSelectedTransaction(booking)
    setIsDetailDialogOpen(true)
  }

  const handleRefundTransaction = (bookingId: string) => {
    toast({
      title: "Đã xử lý hoàn tiền",
      description: `Giao dịch ${bookingId} đã được hoàn tiền`,
    })
  }

  const getStatusBadge = (status: string) => {
    if (!status) return <Badge>Không xác định</Badge>
    
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-500">Thành công</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Chờ xử lý</Badge>
      case "failed":
        return <Badge className="bg-red-500">Thất bại</Badge>
      default:
        return <Badge>Không xác định</Badge>
    }
  }

  const getPaymentMethodText = (method: string) => {
    if (!method) return "Không xác định"
    
    switch (method.toLowerCase()) {
      case "vnpay":
        return "VNPay"
      case "momo":
        return "Ví MoMo"
      default:
        return "Không xác định"
    }
  }

  // Thống kê
  const totalTransactions = totalItems
  const completedTransactions = bookings.filter((b) => b.status?.toLowerCase() === "success").length
  const totalRevenue = bookings
    .filter((b) => b.status?.toLowerCase() === "success")
    .reduce((sum, b) => sum + b.totalPrice, 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý giao dịch</h1>
        {/* <Button>
          <Download className="mr-2 h-4 w-4" />
          Xuất báo cáo
        </Button> */}
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng giao dịch</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thành công</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTransactions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString()}đ</div>
          </CardContent>
        </Card> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách giao dịch</CardTitle>
          <CardDescription>Quản lý tất cả giao dịch thanh toán trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm giao dịch, khách hàng..."
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
                <SelectItem value="Completed">Thành công</SelectItem> 
                <SelectItem value="Failed">Thất bại</SelectItem>
              </SelectContent>
            </Select>
            {/* <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Phương thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phương thức</SelectItem>
                <SelectItem value="vnpay">VNPay</SelectItem>
                <SelectItem value="momo">MoMo</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã GD</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Sự kiện</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Phương thức</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày GD</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-2">Đang tải dữ liệu...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Không tìm thấy giao dịch nào
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.user?.fullName || booking.user?.userName || "Không có tên"}</div>
                          <div className="text-sm text-muted-foreground">{booking.user?.email || "Không có email"}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{booking.schedule?.event?.name || "Không có tên sự kiện"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{booking.totalPrice?.toLocaleString() || 0}đ</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{getPaymentMethodText(booking.method)}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>{new Date(booking.createdAt).toLocaleString()}//{booking.createdAt}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleViewTransaction(booking)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
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
          <div className="text-sm text-muted-foreground">
            Hiển thị {bookings.length} trên tổng số {totalItems} giao dịch
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1 || isLoading}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Trước
            </Button>
            <div className="flex items-center gap-1">
              <span className="text-sm">Trang</span>
              <span className="text-sm font-medium">{currentPage}</span>
              <span className="text-sm">/ {totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages || isLoading}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Sau
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Dialog chi tiết giao dịch */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]  max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết giao dịch {selectedTransaction?.id}</DialogTitle>
            <DialogDescription>Thông tin chi tiết về giao dịch thanh toán</DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Thông tin giao dịch</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Mã GD:</span> {selectedTransaction.id}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Ngày GD:</span>{" "}
                      {new Date(selectedTransaction.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Phương thức:</span>{" "}
                      {getPaymentMethodText(selectedTransaction.method)}
                    </p>
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">Trạng thái:</span>{" "}
                      {getStatusBadge(selectedTransaction.status)}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Thông tin khách hàng</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Tên:</span>{" "}
                      {selectedTransaction.user?.fullName || selectedTransaction.user?.userName || "Không có tên"}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Email:</span>{" "}
                      {selectedTransaction.user?.email || "Không có email"}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Số điện thoại:</span>{" "}
                      {selectedTransaction.user?.phoneNumber || "Không có số điện thoại"}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Sự kiện:</span>{" "}
                      {selectedTransaction.schedule?.event?.name || "Không có tên sự kiện"}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Chi tiết vé</h4>
                  <div className="space-y-1 text-sm">
                    {selectedTransaction.tickets.map((ticket) => (
                      <div key={ticket.id} className="border-b pb-2">
                        <p>
                          <span className="text-muted-foreground">Ghế:</span> {ticket.seat.id} -{" "}
                          {ticket.seat.category}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Giá:</span> {ticket.price.toLocaleString()}đ
                        </p>
                        <p>
                          <span className="text-muted-foreground">Trạng thái:</span>{" "}
                          {ticket.isUsed ? "Đã sử dụng" : "Chưa sử dụng"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Tổng tiền</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-lg font-semibold">
                      {selectedTransaction.totalPrice.toLocaleString()}đ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
