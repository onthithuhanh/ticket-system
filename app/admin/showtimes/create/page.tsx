"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Calendar, DollarSign } from "lucide-react"

export default function CreateShowtimePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    playId: "",
    roomId: "",
    date: "",
    time: "",
    vipPrice: "",
    standardPrice: "",
    economyPrice: "",
    notes: "",
  })

  // Dữ liệu mẫu cho vở kịch và phòng
  const plays = [
    { id: 1, title: "Lôi Vũ", duration: 120, status: "active" },
    { id: 2, title: "Romeo và Juliet", duration: 150, status: "active" },
    { id: 3, title: "Người Đàn Bà Điên", duration: 90, status: "active" },
    { id: 4, title: "Hồ Thiên Nga", duration: 180, status: "active" },
  ]

  const rooms = [
    { id: 1, name: "Sân khấu chính", capacity: 500, status: "active" },
    { id: 2, name: "Sân khấu nhỏ", capacity: 150, status: "active" },
    { id: 3, name: "Sân khấu ngoài trời", capacity: 800, status: "active" },
    { id: 4, name: "Hội trường", capacity: 200, status: "maintenance" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Giả lập tạo xuất chiếu
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Tạo xuất chiếu thành công",
        description: "Xuất chiếu mới đã được tạo và lưu vào hệ thống",
      })

      router.push("/admin/showtimes")
    } catch (error) {
      toast({
        title: "Lỗi tạo xuất chiếu",
        description: "Đã xảy ra lỗi khi tạo xuất chiếu. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const selectedPlay = plays.find((play) => play.id.toString() === formData.playId)
  const selectedRoom = rooms.find((room) => room.id.toString() === formData.roomId)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Link href="/admin/showtimes">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tạo xuất chiếu mới</h1>
          <p className="text-muted-foreground">Thêm xuất chiếu mới vào hệ thống</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Thông tin xuất chiếu
                </CardTitle>
                <CardDescription>Chọn vở kịch, phòng và thời gian</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="playId">Vở kịch *</Label>
                  <Select value={formData.playId} onValueChange={(value) => handleInputChange("playId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn vở kịch" />
                    </SelectTrigger>
                    <SelectContent>
                      {plays
                        .filter((play) => play.status === "active")
                        .map((play) => (
                          <SelectItem key={play.id} value={play.id.toString()}>
                            {play.title} ({play.duration} phút)
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roomId">Phòng chiếu *</Label>
                  <Select value={formData.roomId} onValueChange={(value) => handleInputChange("roomId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng chiếu" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms
                        .filter((room) => room.status === "active")
                        .map((room) => (
                          <SelectItem key={room.id} value={room.id.toString()}>
                            {room.name} ({room.capacity} ghế)
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Ngày chiếu *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Giờ chiếu *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange("time", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {selectedPlay && selectedRoom && formData.date && formData.time && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Thông tin xuất chiếu</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>
                        <strong>Vở kịch:</strong> {selectedPlay.title}
                      </p>
                      <p>
                        <strong>Phòng:</strong> {selectedRoom.name}
                      </p>
                      <p>
                        <strong>Thời gian:</strong> {formData.date} lúc {formData.time}
                      </p>
                      <p>
                        <strong>Thời lượng:</strong> {selectedPlay.duration} phút
                      </p>
                      <p>
                        <strong>Sức chứa:</strong> {selectedRoom.capacity} ghế
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Giá vé
                </CardTitle>
                <CardDescription>Thiết lập giá vé cho các loại ghế</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vipPrice">Giá vé VIP (VNĐ) *</Label>
                    <Input
                      id="vipPrice"
                      type="number"
                      value={formData.vipPrice}
                      onChange={(e) => handleInputChange("vipPrice", e.target.value)}
                      placeholder="500000"
                      required
                    />
                    <p className="text-xs text-muted-foreground">Ghế hạng sang, vị trí tốt nhất</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="standardPrice">Giá vé thường (VNĐ) *</Label>
                    <Input
                      id="standardPrice"
                      type="number"
                      value={formData.standardPrice}
                      onChange={(e) => handleInputChange("standardPrice", e.target.value)}
                      placeholder="300000"
                      required
                    />
                    <p className="text-xs text-muted-foreground">Ghế tiêu chuẩn, vị trí trung tâm</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="economyPrice">Giá vé tiết kiệm (VNĐ) *</Label>
                    <Input
                      id="economyPrice"
                      type="number"
                      value={formData.economyPrice}
                      onChange={(e) => handleInputChange("economyPrice", e.target.value)}
                      placeholder="200000"
                      required
                    />
                    <p className="text-xs text-muted-foreground">Ghế phổ thông, giá cả hợp lý</p>
                  </div>
                </div>

                {formData.vipPrice && formData.standardPrice && formData.economyPrice && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">Dự kiến doanh thu tối đa</h4>
                    <div className="text-sm text-green-700">
                      {selectedRoom && (
                        <p>
                          Dựa trên sức chứa {selectedRoom.capacity} ghế với tỷ lệ phân bố: VIP 20%, Thường 50%, Tiết
                          kiệm 30%
                        </p>
                      )}
                      {selectedRoom && formData.vipPrice && formData.standardPrice && formData.economyPrice && (
                        <p className="font-medium">
                          Doanh thu tối đa:{" "}
                          {(
                            Math.floor(selectedRoom.capacity * 0.2) * Number.parseInt(formData.vipPrice) +
                            Math.floor(selectedRoom.capacity * 0.5) * Number.parseInt(formData.standardPrice) +
                            Math.floor(selectedRoom.capacity * 0.3) * Number.parseInt(formData.economyPrice)
                          ).toLocaleString()}
                          đ
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ghi chú</CardTitle>
                <CardDescription>Thông tin bổ sung cho xuất chiếu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Ghi chú</Label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Ghi chú đặc biệt cho xuất chiếu này..."
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kiểm tra xung đột</CardTitle>
                <CardDescription>Kiểm tra lịch trình phòng</CardDescription>
              </CardHeader>
              <CardContent>
                {formData.roomId && formData.date ? (
                  <div className="space-y-2">
                    <div className="text-sm text-green-600">✓ Phòng trống vào thời gian đã chọn</div>
                    <div className="text-xs text-muted-foreground">
                      Không có xuất chiếu nào khác trong khoảng thời gian này
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Chọn phòng và ngày để kiểm tra xung đột lịch trình
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thời gian khuyến nghị</CardTitle>
                <CardDescription>Khung giờ phổ biến</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Buổi chiều:</span>
                    <span className="text-muted-foreground">14:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Buổi tối:</span>
                    <span className="text-muted-foreground">19:00 - 21:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cuối tuần:</span>
                    <span className="text-muted-foreground">10:00 - 22:00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/showtimes">
            <Button type="button" variant="outline">
              Hủy
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang tạo..." : "Tạo xuất chiếu"}
          </Button>
        </div>
      </form>
    </div>
  )
}
