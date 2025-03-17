"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Edit, Save } from "lucide-react"
import { roomsApi, Room, RoomCategory, RoomStatus, SeatCategory, Seat } from "@/lib/api/rooms"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { amenitiesApi } from "@/lib/api/amenities"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Amenity {
  id: number
  name: string
  description: string
}

export default function RoomDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { id } = resolvedParams
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [room, setRoom] = useState<Room | null>(null)
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [seats, setSeats] = useState<Seat[]>([])
  const [columnCount, setColumnCount] = useState(5)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [roomData, amenitiesData] = await Promise.all([
          roomsApi.getRoom(parseInt(id)),
          amenitiesApi.getAmenities()
        ])
        setRoom(roomData)
        setAmenities(amenitiesData)
        setSeats(roomData.seats || [])
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin phòng",
          variant: "destructive",
        })
        router.push("/admin/rooms")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [id, router, toast])

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.Active:
        return "bg-green-500"
      case RoomStatus.Inactive:
        return "bg-gray-500"
      case RoomStatus.Maintenance:
        return "bg-yellow-500"
      case RoomStatus.Closed:
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getCategoryLabel = (category: RoomCategory) => {
    switch (category) {
      case RoomCategory.Stage:
        return "Sân khấu"
      case RoomCategory.Studio:
        return "Studio"
      case RoomCategory.Outdoor:
        return "Ngoài trời"
      case RoomCategory.Hall:
        return "Hội trường"
      case RoomCategory.Vip:
        return "VIP"
      default:
        return category
    }
  }

  const getSeatColor = (seat: Seat) => {
    if (seat.status === "Blocked") return "bg-gray-200 opacity-50"
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

  const handleSaveSeats = async () => {
    try {
      if (!room) return
      
      await roomsApi.updateRoom(room.id, {
        seats: seats
      })

      toast({
        title: "Thành công",
        description: "Đã lưu sơ đồ ghế",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lưu sơ đồ ghế",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Đang tải...</div>
  }

  if (!room) {
    return <div>Không tìm thấy thông tin phòng</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/rooms">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{room.name}</h1>
            <p className="text-muted-foreground">Chi tiết thông tin phòng</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/rooms/${id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="seats">Quản lý ghế</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <div className="grid grid-cols-3 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cơ bản</CardTitle>
                  <CardDescription>Thông tin chi tiết về phòng</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Loại phòng</h3>
                      <p className="mt-1">{getCategoryLabel(room.category)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Trạng thái</h3>
                      <Badge className={`mt-1 ${getStatusColor(room.status)}`}>{room.status}</Badge>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Vị trí</h3>
                      <p className="mt-1">{room.location}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Sức chứa</h3>
                      <p className="mt-1">{room.capacity} người</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Mô tả</h3>
                    <p className="mt-1">{room.description}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tiện nghi</CardTitle>
                  <CardDescription>Các tiện nghi có trong phòng</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {room.roomAmenities.map((amenity) => {
                      const amenityDetail = amenities.find(a => a.id === amenity.amenityId)
                      return (
                        <div key={amenity.amenityId} className="flex items-center space-x-2">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <span>{amenityDetail?.name || amenity.amenityId}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kích thước phòng</CardTitle>
                  <CardDescription>Kích thước thực tế của phòng</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Chiều dài</h3>
                      <p className="mt-1">{room.length}m</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Chiều rộng</h3>
                      <p className="mt-1">{room.width}m</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Chiều cao</h3>
                      <p className="mt-1">{room.height}m</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Diện tích</h3>
                      <p className="mt-1">{(room.length * room.width).toFixed(1)}m²</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hình ảnh</CardTitle>
                  <CardDescription>Hình ảnh của phòng</CardDescription>
                </CardHeader>
                <CardContent>
                  {room.roomImages.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Chưa có hình ảnh</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {room.roomImages.map((image, index) => (
                        <div key={index} className="aspect-video rounded-lg bg-muted">
                          <img
                            src={image.imageUrl}
                            alt={`Hình ảnh phòng ${index + 1}`}
                            className="h-full w-full rounded-lg object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="seats">
          <Card>
            <CardHeader>
              <CardTitle>Quản lý sơ đồ ghế</CardTitle>
              <CardDescription>Thiết lập sơ đồ ghế cho phòng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
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
              </div>

              <div className="flex justify-center">
                <div 
                  className="grid gap-2" 
                  style={{ 
                    gridTemplateColumns: `repeat(${room.numberSeatsOfRow}, minmax(0, 1fr))`,
                    maxWidth: '100%',
                    overflowX: 'auto'
                  }}
                >
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
                                    <SelectItem value="Blocked">Không sử dụng</SelectItem> 
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

              <div className="flex justify-end">
                <Button onClick={handleSaveSeats}>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu sơ đồ ghế
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
