"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { TableCell } from "@/components/ui/table"

export default function AdminUsersPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  })

  // Dữ liệu mẫu cho người dùng
  const users = [
    {
      id: 1,
      name: "Nguyễn Thị Hương",
      email: "huong.nguyen@example.com",
      phone: "0912345678",
      role: "customer",
      status: "active",
      joinDate: "15/01/2023",
      lastLogin: "20/06/2023",
      totalTickets: 12,
      totalSpent: 3600000,
      avatar: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-3.jpg",
    },
    {
      id: 2,
      name: "Trần Văn Lâm",
      email: "lam.tran@example.com",
      phone: "0987654321",
      role: "customer",
      status: "active",
      joinDate: "20/02/2023",
      lastLogin: "19/06/2023",
      totalTickets: 8,
      totalSpent: 2400000,
      avatar: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-3.jpg",
    },
    {
      id: 3,
      name: "Phạm Minh Hiếu",
      email: "hieu.pham@example.com",
      phone: "0901234567",
      role: "employee",
      status: "active",
      joinDate: "10/03/2023",
      lastLogin: "21/06/2023",
      totalTickets: 0,
      totalSpent: 0,
      avatar: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-3.jpg",
    },
    {
      id: 4,
      name: "Lê Thị Mai",
      email: "mai.le@example.com",
      phone: "0934567890",
      role: "customer",
      status: "inactive",
      joinDate: "05/04/2023",
      lastLogin: "10/05/2023",
      totalTickets: 3,
      totalSpent: 900000,
      avatar: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-3.jpg",
    },
    {
      id: 5,
      name: "Vũ Đức Anh",
      email: "anh.vu@example.com",
      phone: "0945678901",
      role: "manager",
      status: "active",
      joinDate: "01/01/2023",
      lastLogin: "21/06/2023",
      totalTickets: 0,
      totalSpent: 0,
      avatar: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-3.jpg",
    },
  ]

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleCreateUser = () => {
    toast({
      title: "Tạo người dùng thành công",
      description: `Đã tạo tài khoản cho ${newUser.name}`,
    })
    setIsCreateDialogOpen(false)
    setNewUser({ name: "", email: "", phone: "", role: "" })
  }

  const handleDeleteUser = (id: number, name: string) => {
    toast({
      title: "Đã xóa người dùng",
      description: `Đã xóa tài khoản của ${name}`,
    })
  }

  const handleToggleStatus = (id: number, name: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"
    toast({
      title: "Cập nhật trạng thái",
      description: `Đã ${newStatus === "active" ? "kích hoạt" : "vô hiệu hóa"} tài khoản của ${name}`,
    })
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-500">Quản trị viên</Badge>
      case "manager":
        return <Badge className="bg-purple-500">Quản lý</Badge>
      case "employee":
        return <Badge className="bg-blue-500">Nhân viên</Badge>
      case "customer":
        return <Badge className="bg-green-500">Khách hàng</Badge>
      default:
        return <Badge>Không xác định</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Hoạt động</Badge>
      case "inactive":
        return <Badge className="bg-gray-500">Không hoạt động</Badge>
      case "suspended":
        return <Badge className="bg-red-500">Bị khóa</Badge>
      default:
        return <Badge>Không xác định</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Thêm người dùng
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tạo người dùng mới</DialogTitle>
              <DialogDescription>Nhập thông tin để tạo tài khoản người dùng mới</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Họ tên
                </Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Điện thoại
                </Label>
                <Input
                  id="phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, phone: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Vai trò
                </Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser((prev) => ({ ...prev, role: value }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Khách hàng</SelectItem>
                    <SelectItem value="employee">Nhân viên</SelectItem>
                    <SelectItem value="manager">Quản lý</SelectItem>
                    <SelectItem value="admin">Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateUser}>
                Tạo tài khoản
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                <SelectItem value="customer">Khách hàng</SelectItem>
                <SelectItem value="employee">Nhân viên</SelectItem>
                <SelectItem value="manager">Quản lý</SelectItem>
                <SelectItem value="admin">Quản trị viên</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
                <SelectItem value="suspended">Bị khóa</SelectItem>
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
                  <TableHead>Ngày tham gia</TableHead>
                  <TableHead>Vé đã mua</TableHead>
                  <TableHead>Tổng chi tiêu</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Không tìm thấy người dùng nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                            <div className="text-sm text-muted-foreground">{user.phone}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{user.joinDate}</div>
                          <div className="text-xs text-muted-foreground">Đăng nhập cuối: {user.lastLogin}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{user.totalTickets}</TableCell>
                      <TableCell>{user.totalSpent.toLocaleString()}đ</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(user.id, user.name, user.status)}
                          >
                            {user.status === "active" ? "Vô hiệu hóa" : "Kích hoạt"}
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id, user.name)}>
                            Xóa
                          </Button>
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
            Hiển thị {filteredUsers.length} trên tổng số {users.length} người dùng
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
