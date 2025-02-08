"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { usersApi, User, GetUsersResponse } from "@/lib/api/users"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Label } from "@/components/ui/label"
import { TableCell } from "@/components/ui/table"

export default function AdminUsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    fullName: "",
    password: "",
    roleIds: [] as string[],
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [hasPreviousPage, setHasPreviousPage] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers()
    }, 500)

    return () => clearTimeout(timer)
  }, [currentPage, searchTerm, roleFilter, statusFilter])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response: GetUsersResponse = await usersApi.getUsers({
        pageIndex: currentPage,
        pageSize,
        Search: searchTerm || undefined,
        Role: roleFilter === "all" ? "user" : roleFilter,
        IsActive: statusFilter === "all" ? undefined : statusFilter === "active",
      })
      setUsers(response.contends)
      setTotalPages(response.totalPages)
      setTotalItems(response.totalItems)
      setHasPreviousPage(response.hasPreviousPage)
      setHasNextPage(response.hasNextPage)
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Đã xảy ra lỗi khi tải danh sách người dùng",
        variant: "destructive",
      })
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = async () => {
    try {
      await usersApi.createUser(newUser)
      toast({
        title: "Tạo người dùng thành công",
        description: `Đã tạo tài khoản cho ${newUser.fullName || newUser.userName}`,
      })
      setIsCreateDialogOpen(false)
      setNewUser({
        userName: "",
        email: "",
        phoneNumber: "",
        fullName: "",
        password: "",
        roleIds: [],
      })
      fetchUsers()
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Đã xảy ra lỗi khi tạo người dùng",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (id: string, name: string) => {
    try {
      await usersApi.deleteUser(id)
      toast({
        title: "Đã xóa người dùng",
        description: `Đã xóa tài khoản của ${name}`,
      })
      fetchUsers()
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Đã xảy ra lỗi khi xóa người dùng",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (id: string, name: string, currentStatus: boolean) => {
    try {
      await usersApi.updateUser(id, { isActive: !currentStatus })
      toast({
        title: "Cập nhật trạng thái",
        description: `Đã ${!currentStatus ? "kích hoạt" : "vô hiệu hóa"} tài khoản của ${name}`,
      })
      fetchUsers()
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật trạng thái người dùng",
        variant: "destructive",
      })
    }
  }

  const getRoleBadge = (roles: User["roles"]) => {
    const roleNames = roles.map(role => role.name)
    if (roleNames.includes("Admin")) {
      return <Badge className="bg-red-500">Quản trị viên</Badge>
    }
    if (roleNames.includes("Staff")) {
      return <Badge className="bg-blue-500">Nhân viên</Badge>
    }
    if (roleNames.includes("User")) {
      return <Badge className="bg-green-500">Khách hàng</Badge>
    }
    return <Badge>Không xác định</Badge>
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-500">Hoạt động</Badge>
    ) : (
      <Badge className="bg-gray-500">Không hoạt động</Badge>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>
       
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
          <CardDescription>Quản lý tất cả người dùng trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm người dùng..."
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
              </SelectContent>
            </Select>
          </div>
          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Không tìm thấy người dùng nào
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {user.avatarUrl && (
                            <img
                              src={user.avatarUrl}
                              alt={user.userName}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium">{user.fullName || user.userName}</div>
                            <div className="text-sm text-muted-foreground">{user.email || "Chưa có email"}</div>
                            {user.phoneNumber && <div className="text-sm text-muted-foreground">{user.phoneNumber}</div>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.roles)}</TableCell>
                      <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{new Date(user.createdAt).toLocaleDateString("vi-VN")}</div>
                          <div className="text-xs text-muted-foreground">
                            Cập nhật: {new Date(user.modifiedAt).toLocaleDateString("vi-VN")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(user.id, user.fullName || user.userName, user.isActive)}
                          >
                            {user.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                Xóa
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bạn có chắc chắn muốn xóa tài khoản của {user.fullName || user.userName}? Hành động này
                                  không thể hoàn tác.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id, user.fullName || user.userName)}
                                >
                                  Xóa
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
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
            Hiển thị {users.length} trên tổng số {totalItems} người dùng
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!hasPreviousPage || isLoading}
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
              disabled={!hasNextPage || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
