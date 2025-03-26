"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { roomsApi, RoomCategory, RoomStatus, SeatCategory } from "@/lib/api/rooms"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Amenity {
  id: number;
  name: string;
  description: string;
}

interface Seat {
  id: number;
  row: number;
  column: number;
  category: SeatCategory;
  status: "Available" | "Blocked" | "Reserved";
}

export default function CreateRoomPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: RoomCategory.Stage,
    capacity: "",
    status: RoomStatus.Active,
    description: "",
    location: "",
    selectedAmenities: [] as number[],
    length: "",
    width: "",
    height: "",
    numberSeatsOfRow: "",
    columns: "",
  })

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const data = await roomsApi.getAmenities()
        setAmenities(data)
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách tiện nghi",
          variant: "destructive",
        })
      }
    }
    fetchAmenities()
  }, [toast])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAmenityChange = (amenityId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedAmenities: checked
        ? [...prev.selectedAmenities, amenityId]
        : prev.selectedAmenities.filter((id) => id !== amenityId),
    }))
  }

  const generateSeats = () => {
    const numberSeatsOfRow = parseInt(formData.numberSeatsOfRow)
    const columns = parseInt(formData.columns)
    const totalSeats = numberSeatsOfRow * columns
    const capacity = parseInt(formData.capacity)

    // Kiểm tra sức chứa
    if (capacity < totalSeats) {
      toast({
        title: "Cảnh báo",
        description: `Sức chứa tối đa (${capacity}) không được nhỏ hơn tổng số ghế (${totalSeats}). Vui lòng tăng sức chứa hoặc giảm số ghế.`,
        variant: "destructive",
      })
      return
    }

    // Giới hạn tổng số ghế tối đa là 300
    if (totalSeats > 300) {
      toast({
        title: "Cảnh báo",
        description: "Tổng số ghế không được vượt quá 300. Vui lòng chọn lại số hàng và số ghế mỗi hàng.",
        variant: "destructive",
      })
      return
    }

    const vipCount = Math.floor(totalSeats * 0.2)
    const normalCount = Math.floor(totalSeats * 0.3)

    const newSeats: Seat[] = []
    let seatIndex = 0

    for (let row = 1; row <= numberSeatsOfRow; row++) {
      for (let col = 1; col <= columns; col++) {
        let category = SeatCategory.Economy
        if (seatIndex < vipCount) {
          category = SeatCategory.Vip
        } else if (seatIndex < vipCount + normalCount) {
          category = SeatCategory.Normal
        }

        newSeats.push({
          id: seatIndex + 1,
          row,
          column: col,
          category,
          status: "Available"
        })
        seatIndex++
      }
    }

    setSeats(newSeats)
  }

  const updateSeat = (seatId: number, updates: Partial<Seat>) => {
    setSeats(prev => prev.map(seat =>
      seat.id === seatId ? { ...seat, ...updates } : seat
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const roomData = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        capacity: parseInt(formData.capacity),
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
        numberSeatsOfRow: parseFloat(formData.numberSeatsOfRow),
        status: formData.status,
        category: formData.category,
        roomAmenities: formData.selectedAmenities.map(id => ({ amenityId: id })),
        roomImages: [], // Add image upload functionality later
        seats: seats.map(seat => ({
          id: seat.id,
          status: seat.status,
          category: seat.category
        }))
      }

      const response = await roomsApi.createRoom(roomData)
      toast({
        title: "Tạo phòng thành công",
        description: "Phòng mới đã được tạo với sơ đồ ghế.",
      })

      router.push("/admin/rooms")
    } catch (error: any) {
      toast({
        title: "Lỗi tạo phòng",
        description: error.response?.data?.message || "Đã xảy ra lỗi khi tạo phòng. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getSeatColor = (seat: Seat) => {
    if (seat.status === "Blocked") return "bg-red-200 opacity-50"
    if (seat.status === "Reserved") return "border-2 border-yellow-500 bg-white"
    
    switch (seat.category) {
      case SeatCategory.Vip:
        return "bg-purple-500 text-white"
      case SeatCategory.Normal:
        return "bg-blue-500 text-white"
      case SeatCategory.Economy:
        return "bg-gray-200 text-gray-700"
      default:
        return "bg-gray-200"
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
                    <Label htmlFor="category">Loại phòng *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại phòng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={RoomCategory.Stage}>Sân khấu</SelectItem>
                        <SelectItem value={RoomCategory.Studio}>Studio</SelectItem>
                        <SelectItem value={RoomCategory.Outdoor}>Ngoài trời</SelectItem>
                        <SelectItem value={RoomCategory.Hall}>Hội trường</SelectItem>
                        <SelectItem value={RoomCategory.Vip}>VIP</SelectItem>
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
                        <SelectItem value={RoomStatus.Active}>Hoạt động</SelectItem>
                        <SelectItem value={RoomStatus.Inactive}>Không hoạt động</SelectItem>
                        <SelectItem value={RoomStatus.Maintenance}>Bảo trì</SelectItem>
                        <SelectItem value={RoomStatus.Closed}>Đóng cửa</SelectItem>
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
                  {amenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`amenity-${amenity.id}`}
                        checked={formData.selectedAmenities.includes(amenity.id)}
                        onCheckedChange={(checked) => handleAmenityChange(amenity.id, checked as boolean)}
                      />
                      <Label htmlFor={`amenity-${amenity.id}`} className="text-sm font-normal">
                        {amenity.name}
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
          </div>
          <div className="lg:col-span-3 space-y-6" >
            <Card>
              <CardHeader>
                <CardTitle>Sơ đồ ghế</CardTitle>
                <CardDescription>Thiết lập sơ đồ ghế cho phòng</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid col-span-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numberSeatsOfRow">Số hàng ghế *</Label>
                    <Select 
                      value={formData.numberSeatsOfRow} 
                      onValueChange={(value) => handleInputChange("numberSeatsOfRow", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn số hàng ghế" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} hàng
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="columns">Số ghế mỗi hàng *</Label>
                    <Select 
                      value={formData.columns} 
                      onValueChange={(value) => handleInputChange("columns", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn số ghế mỗi hàng" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} ghế
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={generateSeats}
                  disabled={!formData.numberSeatsOfRow || !formData.columns}
                >
                  Tạo sơ đồ ghế
                </Button>

                {seats.length > 0 && (
                  <div className="mt-4">
                    <div className="grid gap-2">
                      {Array.from({ length: parseInt(formData.numberSeatsOfRow) }, (_, rowIndex) => (
                        <div key={rowIndex} className="flex gap-2">
                          {Array.from({ length: parseInt(formData.columns) }, (_, colIndex) => {
                            const seat = seats.find(s => s.row === rowIndex + 1 && s.column === colIndex + 1)
                            if (!seat) return null
                            return (
                              <Popover key={seat.id}>
                                <PopoverTrigger asChild>
                                  <div
                                    className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium cursor-pointer
                                      ${getSeatColor(seat)}
                                      ${seat.status === 'Blocked' ? 'opacity-50' : ''} `}
                                  >
                                    {seat.id}
                                  </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                  <div className="space-y-4">
                                    <div>
                                      <Label>Ghế {seat.id}</Label>
                                      <div className="mt-2 space-y-2">
                                        <div>
                                          <Label>Loại ghế</Label>
                                          <Select
                                            value={seat.category}
                                            onValueChange={(value) => updateSeat(seat.id, { category: value as SeatCategory })}
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value={SeatCategory.Vip}>VIP</SelectItem>
                                              <SelectItem value={SeatCategory.Normal}>Thường</SelectItem>
                                              <SelectItem value={SeatCategory.Economy}>Tiết kiệm</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div>
                                          <Label>Trạng thái</Label>
                                          <Select
                                            value={seat.status}
                                            onValueChange={(value) => updateSeat(seat.id, { status: value as Seat['status'] })}
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="Available">Có sẵn</SelectItem>
                                              <SelectItem value="Blocked">Không sử dụng</SelectItem> 
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-purple-500 rounded"></div>
                        <span className="text-sm">VIP</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span className="text-sm">Thường</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                        <span className="text-sm">Tiết kiệm</span>
                      </div>
                     
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-200 opacity-50 rounded"></div>
                        <span className="text-sm">Không sử dụng</span>
                      </div>
                    </div>
                  </div>
                )}
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
          <Button type="submit" disabled={isLoading || seats.length === 0}>
            {isLoading ? "Đang tạo..." : "Tạo phòng"}
          </Button>
        </div>
      </form>
    </div>
  )
}
