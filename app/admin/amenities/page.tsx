"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { amenitiesApi } from "@/lib/api/amenities"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface Amenity {
  id: string
  name: string
}

export default function AmenitiesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchAmenities()
  }, [])

  const fetchAmenities = async () => {
    try {
      const response = await amenitiesApi.getAmenities()
      setAmenities(response)
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Đã xảy ra lỗi khi tải danh sách tiện nghi",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tiện nghi này?")) return

    try {
      await amenitiesApi.deleteAmenity(id)
      toast({
        title: "Thành công",
        description: "Xóa tiện nghi thành công",
      })
      fetchAmenities()
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Đã xảy ra lỗi khi xóa tiện nghi",
        variant: "destructive",
      })
    }
  }

  const filteredAmenities = amenities.filter((amenity) =>
    amenity.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredAmenities.length / itemsPerPage)
  const paginatedAmenities = filteredAmenities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Danh sách tiện nghi</h1>
          <p className="text-muted-foreground">Quản lý các tiện nghi của hệ thống nhà hát</p>
        </div>
        <Button asChild>
          <Link href="/admin/amenities/create">
            <Plus className="mr-2 h-4 w-4" />
            Thêm tiện nghi
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="flex items-center justify-between">
          <CardHeader>
            <CardTitle>Tìm kiếm</CardTitle>
            <CardDescription>Tìm kiếm tiện nghi theo tên</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2"> 
              <Input
                placeholder="Tìm kiếm tiện nghi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-max"
              />
            </div>
          </CardContent></div>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tiện nghi</CardTitle>
          <CardDescription>Danh sách các tiện nghi hiện có</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Đang tải...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên tiện nghi</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAmenities.map((amenity) => (
                    <TableRow key={amenity.id}>
                      <TableCell className="font-medium">{amenity.name}</TableCell>
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/amenities/${amenity.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(amenity.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Trước
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Trang {currentPage} / {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
