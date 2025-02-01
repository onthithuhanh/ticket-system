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
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CreateRoomPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    capacity: "",
    status: "active",
    description: "",
    location: "",
    facilities: [] as string[],
    length: "",
    width: "",
    height: "",
  })

  const facilityOptions = [
    "Âm thanh 5.1",
    "Âm thanh cơ bản",
    "Âm thanh ngoài trời",
    "Âm thanh hội nghị",
    "Âm thanh cao cấp",
    "Màn hình LED",
    "Màn hình lớn",
    "Projector",
    "Ánh sáng sân khấu",
    "Điều hòa",
    "Wifi",
    "Hệ thống thoát nước",
    "Ghế da",
    "Minibar",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFacilityChange = (facility: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      facilities: checked ? [...prev.facilities, facility] : prev.facilities.filter((f) => f !== facility),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Giả lập tạo phòng
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Tạo phòng thành công",
        description: "Phòng mới đã được tạo. Bạn có thể thiết lập sơ đồ ghế trong bước tiếp theo.",
      })

      // Chuyển đến trang quản lý ghế của phòng vừa tạo (giả sử ID = 6)
      router.push("/admin/rooms/6/seats")
    } catch (error) {
      toast({
        title: "Lỗi tạo phòng",
        description: "Đã xảy ra lỗi khi tạo phòng. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Link href="/admin/rooms">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tạo phòng mới</h1>
          <p className="text-muted-foreground">Thêm phòng mới vào hệ thống</p>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Sau khi tạo phòng thành công, bạn sẽ được chuyển đến trang thiết lập sơ đồ ghế để cấu hình chi tiết.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>Nhập thông tin cơ bản về phòng</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên phòng *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Nhập tên phòng"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Loại phòng *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại phòng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="theater">Sân khấu</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                        <SelectItem value="outdoor">Ngoài trời</SelectItem>
                        <SelectItem value="conference">Hội trường</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Sức chứa tối đa *</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange("capacity", e.target.value)}
                      placeholder="Số người tối đa"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Vị trí *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="Vị trí phòng (VD: Tầng 1, Khu A)"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Trạng thái *</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">Không hoạt động</SelectItem>
                        <SelectItem value="maintenance">Bảo trì</SelectItem>
                        <SelectItem value="closed">Đóng cửa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Mô tả về phòng, đặc điểm nổi bật..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tiện nghi</CardTitle>
                <CardDescription>Chọn các tiện nghi có trong phòng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {facilityOptions.map((facility) => (
                    <div key={facility} className="flex items-center space-x-2">
                      <Checkbox
                        id={facility}
                        checked={formData.facilities.includes(facility)}
                        onCheckedChange={(checked) => handleFacilityChange(facility, checked as boolean)}
                      />
                      <Label htmlFor={facility} className="text-sm font-normal">
                        {facility}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kích thước phòng</CardTitle>
                <CardDescription>Nhập kích thước thực tế của phòng</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="length">Chiều dài (m)</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.1"
                    value={formData.length}
                    onChange={(e) => handleInputChange("length", e.target.value)}
                    placeholder="30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">Chiều rộng (m)</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.1"
                    value={formData.width}
                    onChange={(e) => handleInputChange("width", e.target.value)}
                    placeholder="25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Chiều cao (m)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    value={formData.height}
                    onChange={(e) => handleInputChange("height", e.target.value)}
                    placeholder="8"
                  />
                </div>
                {formData.length && formData.width && (
                  <div className="pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      <p>
                        Diện tích: {(Number.parseFloat(formData.length) * Number.parseFloat(formData.width)).toFixed(1)}{" "}
                        m²
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bước tiếp theo</CardTitle>
                <CardDescription>Sau khi tạo phòng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Thiết lập sơ đồ ghế</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Phân loại ghế (VIP, Thường, Tiết kiệm)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Cấu hình vị trí ghế</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/rooms">
            <Button type="button" variant="outline">
              Hủy
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang tạo..." : "Tạo phòng & Thiết lập ghế"}
          </Button>
        </div>
      </form>
    </div>
  )
}
