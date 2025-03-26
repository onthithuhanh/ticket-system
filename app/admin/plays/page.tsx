"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, Theater } from "lucide-react"
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

export default function AdminPlaysPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [genreFilter, setGenreFilter] = useState("all")

  // Dữ liệu mẫu cho vở kịch
  const plays = [
    {
      id: 1,
      title: "Lôi Vũ",
      genre: "Drame",
      duration: 120,
      status: "active",
      description: "Một vở kịch cảm động về tình yêu và sự hy sinh trong thời chiến",
      director: "Nguyễn Văn A",
      cast: ["Trần Thị B", "Lê Văn C", "Phạm Thị D"],
      language: "vietnamese",
      ageRating: "13+",
      createdDate: "15/01/2023",
      lastUpdated: "20/06/2023",
      totalShowtimes: 12,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 2,
      title: "Romeo và Juliet",
      genre: "Drame",
      duration: 150,
      status: "active",
      description: "Tác phẩm kinh điển của Shakespeare về tình yêu bất diệt",
      director: "Lê Thị E",
      cast: ["Nguyễn Văn F", "Trần Thị G"],
      language: "vietnamese",
      ageRating: "16+",
      createdDate: "20/02/2023",
      lastUpdated: "18/06/2023",
      totalShowtimes: 8,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 3,
      title: "Người Đàn Bà Điên",
      genre: "Drame",
      duration: 90,
      status: "active",
      description: "Vở kịch tâm lý sâu sắc về số phận con người",
      director: "Phạm Văn H",
      cast: ["Lê Thị I", "Nguyễn Văn J"],
      language: "vietnamese",
      ageRating: "18+",
      createdDate: "10/03/2023",
      lastUpdated: "15/06/2023",
      totalShowtimes: 6,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 4,
      title: "Hồ Thiên Nga",
      genre: "Dance",
      duration: 180,
      status: "inactive",
      description: "Tác phẩm múa ballet kinh điển",
      director: "Vũ Thị K",
      cast: ["Đặng Thị L", "Hoàng Văn M"],
      language: "instrumental",
      ageRating: "All",
      createdDate: "05/04/2023",
      lastUpdated: "10/06/2023",
      totalShowtimes: 4,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 5,
      title: "Đêm Kỳ Diệu",
      genre: "Circus",
      duration: 100,
      status: "draft",
      description: "Chương trình xiếc đặc sắc cho mọi lứa tuổi",
      director: "Trần Văn N",
      cast: ["Lê Thị O", "Phạm Văn P", "Nguyễn Thị Q"],
      language: "vietnamese",
      ageRating: "All",
      createdDate: "01/05/2023",
      lastUpdated: "22/06/2023",
      totalShowtimes: 0,
      image: "/placeholder.svg?height=300&width=400",
    },
  ]

  const filteredPlays = plays.filter((play) => {
    const matchesSearch =
      play.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      play.director.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || play.status === statusFilter
    const matchesGenre = genreFilter === "all" || play.genre === genreFilter
    return matchesSearch && matchesStatus && matchesGenre
  })

  const handleDeletePlay = (id: number, title: string) => {
    toast({
      title: "Đã xóa vở kịch",
      description: `Vở kịch "${title}" đã được xóa thành công`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Đang chiếu</Badge>
      case "inactive":
        return <Badge className="bg-gray-500">Ngừng chiếu</Badge>
      case "draft":
        return <Badge className="bg-yellow-500">Bản nháp</Badge>
      case "archived":
        return <Badge className="bg-blue-500">Lưu trữ</Badge>
      default:
        return <Badge>Không xác định</Badge>
    }
  }

  const getGenreText = (genre: string) => {
    switch (genre) {
      case "Drame":
        return "Kịch"
      case "Music":
        return "Âm nhạc"
      case "Dance":
        return "Múa"
      case "Circus":
        return "Xiếc"
      case "Comedy":
        return "Hài kịch"
      case "Opera":
        return "Opera"
      default:
        return "Khác"
    }
  }

  // Thống kê
  const totalPlays = plays.length
  const activePlays = plays.filter((p) => p.status === "active").length
  const totalShowtimes = plays.reduce((sum, p) => sum + p.totalShowtimes, 0)
  const draftPlays = plays.filter((p) => p.status === "draft").length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý vở kịch</h1>
        <Link href="/admin/plays/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm vở kịch mới
          </Button>
        </Link>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số vở kịch</CardTitle>
            <Theater className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlays}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang chiếu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activePlays}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng xuất chiếu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShowtimes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bản nháp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{draftPlays}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách vở kịch</CardTitle>
          <CardDescription>Quản lý tất cả vở kịch trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm vở kịch..."
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
                <SelectItem value="active">Đang chiếu</SelectItem>
                <SelectItem value="inactive">Ngừng chiếu</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
                <SelectItem value="archived">Lưu trữ</SelectItem>
              </SelectContent>
            </Select>
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Thể loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thể loại</SelectItem>
                <SelectItem value="Drame">Kịch</SelectItem>
                <SelectItem value="Music">Âm nhạc</SelectItem>
                <SelectItem value="Dance">Múa</SelectItem>
                <SelectItem value="Circus">Xiếc</SelectItem>
                <SelectItem value="Comedy">Hài kịch</SelectItem>
                <SelectItem value="Opera">Opera</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vở kịch</TableHead>
                  <TableHead>Thể loại</TableHead>
                  <TableHead>Đạo diễn</TableHead>
                  <TableHead>Thời lượng</TableHead>
                  <TableHead>Xuất chiếu</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Cập nhật</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlays.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Không tìm thấy vở kịch nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPlays.map((play) => (
                    <TableRow key={play.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={play.image || "/placeholder.svg"}
                            alt={play.title}
                            className="h-12 w-12 rounded object-cover"
                          />
                          <div>
                            <div className="font-medium">{play.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">{play.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getGenreText(play.genre)}</TableCell>
                      <TableCell>{play.director}</TableCell>
                      <TableCell>{play.duration} phút</TableCell>
                      <TableCell className="text-center">{play.totalShowtimes}</TableCell>
                      <TableCell>{getStatusBadge(play.status)}</TableCell>
                      <TableCell>{play.lastUpdated}</TableCell>
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
                              <Link href={`/admin/plays/${play.id}`} className="flex w-full items-center">
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link href={`/admin/plays/${play.id}/edit`} className="flex w-full items-center">
                                <Edit className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Xóa vở kịch
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Xác nhận xóa vở kịch</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bạn có chắc chắn muốn xóa vở kịch "{play.title}"? Hành động này không thể hoàn tác.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeletePlay(play.id, play.title)}>
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
            Hiển thị {filteredPlays.length} trên tổng số {plays.length} vở kịch
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
