"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Upload } from "lucide-react"

export default function CreatePlayPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    duration: "",
    status: "draft",
    description: "",
    director: "",
    cast: "",
    language: "vietnamese",
    ageRating: "All",
    synopsis: "",
    notes: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Giả lập tạo vở kịch
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Tạo vở kịch thành công",
        description: "Vở kịch mới đã được tạo và lưu vào hệ thống",
      })

      router.push("/admin/plays")
    } catch (error) {
      toast({
        title: "Lỗi tạo vở kịch",
        description: "Đã xảy ra lỗi khi tạo vở kịch. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Link href="/admin/plays">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tạo vở kịch mới</h1>
          <p className="text-muted-foreground">Thêm vở kịch mới vào hệ thống</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>Nhập thông tin cơ bản về vở kịch</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tên vở kịch *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Nhập tên vở kịch"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="genre">Thể loại *</Label>
                    <Select value={formData.genre} onValueChange={(value) => handleInputChange("genre", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn thể loại" />
                      </SelectTrigger>
                      <SelectContent>
                      <SelectItem value="Drame">Kịch</SelectItem>
                        <SelectItem value="Comedy">Hài kịch</SelectItem>
                        <SelectItem value="Opera">Opera</SelectItem>
                        <SelectItem value="Dance">Múa ballet</SelectItem>
                        <SelectItem value="Circus">Xiếc</SelectItem>
                        <SelectItem value="Music">Nhạc kịch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Thời lượng (phút) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                      placeholder="120"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả ngắn *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Mô tả ngắn về vở kịch"
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="synopsis">Tóm tắt nội dung</Label>
                  <Textarea
                    id="synopsis"
                    value={formData.synopsis}
                    onChange={(e) => handleInputChange("synopsis", e.target.value)}
                    placeholder="Tóm tắt chi tiết nội dung vở kịch"
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin sản xuất</CardTitle>
                <CardDescription>Thông tin về đạo diễn và diễn viên</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="director">Đạo diễn *</Label>
                  <Input
                    id="director"
                    value={formData.director}
                    onChange={(e) => handleInputChange("director", e.target.value)}
                    placeholder="Tên đạo diễn"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cast">Diễn viên</Label>
                  <Textarea
                    id="cast"
                    value={formData.cast}
                    onChange={(e) => handleInputChange("cast", e.target.value)}
                    placeholder="Danh sách diễn viên (mỗi tên một dòng)"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Ngôn ngữ</Label>
                    <Select value={formData.language} onValueChange={(value) => handleInputChange("language", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn ngôn ngữ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vietnamese">Tiếng Việt</SelectItem>
                        <SelectItem value="english">Tiếng Anh</SelectItem>
                        <SelectItem value="instrumental">Không lời</SelectItem>
                        <SelectItem value="mixed">Đa ngôn ngữ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ageRating">Độ tuổi</Label>
                    <Select value={formData.ageRating} onValueChange={(value) => handleInputChange("ageRating", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn độ tuổi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">Mọi lứa tuổi</SelectItem>
                        <SelectItem value="13+">13+</SelectItem>
                        <SelectItem value="16+">16+</SelectItem>
                        <SelectItem value="18+">18+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Ghi chú thêm về vở kịch"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hình ảnh</CardTitle>
                <CardDescription>Tải lên poster và hình ảnh</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Button type="button" variant="outline">
                      Chọn hình ảnh
                    </Button>
                    <p className="mt-2 text-sm text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trạng thái</CardTitle>
                <CardDescription>Thiết lập trạng thái vở kịch</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái *</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Bản nháp</SelectItem>
                      <SelectItem value="active">Đang chiếu</SelectItem>
                      <SelectItem value="inactive">Ngừng chiếu</SelectItem>
                      <SelectItem value="archived">Lưu trữ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    <strong>Bản nháp:</strong> Chưa công khai
                  </p>
                  <p>
                    <strong>Đang chiếu:</strong> Có thể tạo xuất chiếu
                  </p>
                  <p>
                    <strong>Ngừng chiếu:</strong> Tạm dừng xuất chiếu
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/plays">
            <Button type="button" variant="outline">
              Hủy
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang tạo..." : "Tạo vở kịch"}
          </Button>
        </div>
      </form>
    </div>
  )
}
