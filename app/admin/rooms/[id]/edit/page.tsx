"use client"

import { useState, useEffect, use } from "react"
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
import { ArrowLeft, Save } from "lucide-react"
import { roomsApi, Room, RoomCategory, RoomStatus, SeatCategory } from "@/lib/api/rooms"
import { amenitiesApi } from "@/lib/api/amenities"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Amenity {
  id: number
  name: string
  description: string
}

interface Seat {
  id: number
  category: SeatCategory
  status: "Available" | "Unavailable" | "Reserved"
}

export default function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { id } = resolvedParams
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [seats, setSeats] = useState<Seat[]>([])
  const [formData, setFormData] = useState({
    name: "",
    category: "" as RoomCategory,
    capacity: "",
    status: "" as RoomStatus,
    description: "",
    location: "",
    selectedAmenities: [] as number[],
    length: "",
    width: "",
    height: "",
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [room, amenitiesData] = await Promise.all([
          roomsApi.getRoom(parseInt(id)),
          amenitiesApi.getAmenities()
        ])
        setAmenities(amenitiesData)
        setFormData({
          name: room.name,
          category: room.category,
          capacity: room.capacity.toString(),
          status: room.status,
          description: room.description,
          location: room.location,
          selectedAmenities: room.roomAmenities.map(a => a.amenityId),
          length: room.length.toString(),
          width: room.width.toString(),
          height: room.height.toString(),
        })

        // Set seats from API response
        if (room.seats) {
          setSeats(room.seats)
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin phòng",
          variant: "destructive",
        })
        router.push("/admin/rooms")
      }
    }

    loadData()
  }, [id, router, toast])

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

  const getSeatColor = (seat: Seat) => {
    if (seat.status === "Unavailable") return "bg-gray-200 opacity-50"
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

  const updateSeat = (seatId: number, updates: Partial<Seat>) => {
    setSeats(prev => prev.map(seat => 
      seat.id === seatId ? { ...seat, ...updates } : seat
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await roomsApi.updateRoom(parseInt(id), {
        name: formData.name,
        category: formData.category as RoomCategory,
        status: formData.status as RoomStatus,
        location: formData.location,
        capacity: parseInt(formData.capacity),
        description: formData.description,
        roomAmenities: formData.selectedAmenities.map(id => ({ amenityId: id })),
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
        seats: seats
      })

      toast({
        title: "Cập nhật phòng thành công",
        description: "Thông tin phòng đã được cập nhật",
      })

      router.push("/admin/rooms")
    } catch (error) {
      toast({
        title: "Lỗi cập nhật phòng",
        description: "Đã xảy ra lỗi khi cập nhật phòng. Vui lòng thử lại.",
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
          <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa phòng</h1>
          <p className="text-muted-foreground">Cập nhật thông tin phòng</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>Cập nhật thông tin cơ bản về phòng</CardDescription>
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
                      placeholder="Vị trí phòng"
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
                    placeholder="Mô tả về phòng"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tiện nghi</CardTitle>
                <CardDescription>Cập nhật các tiện nghi có trong phòng</CardDescription>
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
                <CardDescription>Cập nhật kích thước thực tế của phòng</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="length">Chiều dài (m) *</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.1"
                    value={formData.length}
                    onChange={(e) => handleInputChange("length", e.target.value)}
                    placeholder="30"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">Chiều rộng (m) *</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.1"
                    value={formData.width}
                    onChange={(e) => handleInputChange("width", e.target.value)}
                    placeholder="25"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Chiều cao (m) *</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    value={formData.height}
                    onChange={(e) => handleInputChange("height", e.target.value)}
                    placeholder="8"
                    required
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
                <CardTitle>Quản lý ghế</CardTitle>
                <CardDescription>Thiết lập sơ đồ ghế cho phòng</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-purple-500" />
                    <span>VIP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-blue-500" />
                    <span>Thường</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-gray-200" />
                    <span>Tiết kiệm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-yellow-500 bg-white rounded-full" />
                    <span>Đã đặt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-gray-200 opacity-50 rounded-full" />
                    <span>Không sử dụng</span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="grid grid-cols-10 gap-2">
                    {seats.map((seat) => (
                      <Popover key={seat.id}>
                        <PopoverTrigger asChild>
                          <button
                            className={`h-8 w-8 rounded flex items-center justify-center text-xs font-medium cursor-pointer ${getSeatColor(seat)}`}
                          >
                            {seat.id}
                          </button>
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
                                      <SelectItem value="Unavailable">Không sử dụng</SelectItem>
                                      <SelectItem value="Reserved">Đã đặt trước</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ))}
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
            {isLoading ? "Đang cập nhật..." : "Cập nhật phòng"}
          </Button>
        </div>
      </form>
    </div>
  )
}
