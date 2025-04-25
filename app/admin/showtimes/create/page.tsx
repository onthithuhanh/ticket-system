"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import { eventsApi, Event } from "@/lib/api/events"
import { roomsApi, Room, RoomStatus } from "@/lib/api/rooms"
import { showtimesApi, CreateShowtimeParams } from "@/lib/api/showtimes"

export default function CreateShowtimePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [formData, setFormData] = useState({
    startTime: "",
    priceVip: "",
    priceNormal: "",
    priceEconomy: "",
    eventId: "",
    roomId: "",
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsResponse, roomsResponse] = await Promise.all([
          eventsApi.getEvents({ pageIndex: 1, pageSize: 100, isCancelled: false }),
          roomsApi.getRooms({ pageIndex: 1, pageSize: 100, status: RoomStatus.Active })
        ])
        setEvents(eventsResponse.contends)
        setRooms(roomsResponse.contends)
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu",
          variant: "destructive",
        })
      }
    }

    loadData()
  }, [toast])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const selectedDate = new Date(formData.startTime)
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      if (selectedDate < tomorrow) {
        toast({
          title: "Lỗi",
          description: "Thời gian bắt đầu phải là ngày mai trở đi",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const priceVip = parseInt(formData.priceVip)
      const priceNormal = parseInt(formData.priceNormal)
      const priceEconomy = parseInt(formData.priceEconomy)

      if (priceVip <= 10000 || priceNormal <= 10000 || priceEconomy <= 10000) {
        toast({
          title: "Lỗi",
          description: "Giá vé phải lớn hơn 10,000 VNĐ",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const showtimeData: CreateShowtimeParams = {
        startTime: selectedDate.toISOString(),
        priceVip,
        priceNormal,
        priceEconomy,
        eventId: parseInt(formData.eventId),
        roomId: parseInt(formData.roomId),
      }

      await showtimesApi.createShowtime(showtimeData)

      toast({
        title: "Tạo xuất chiếu thành công",
        description: "Xuất chiếu mới đã được tạo và lưu vào hệ thống",
      })

      router.push("/admin/showtimes")
    } catch (error: any) {
      console.log(error?.response?.data?.detail);

      toast({
        title: "Lỗi tạo xuất chiếu",
        description: error?.response ? error?.response?.data?.detail : "Đã xảy ra lỗi khi tạo xuất chiếu. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
        <Card>
          <CardHeader>
            <CardTitle>Thông tin xuất chiếu</CardTitle>
            <CardDescription>Nhập thông tin cho xuất chiếu mới</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eventId">Sự kiện *</Label>
              <Select value={formData.eventId} onValueChange={(value) => handleInputChange("eventId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn sự kiện" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id.toString()}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomId">Phòng *</Label>
              <Select value={formData.roomId} onValueChange={(value) => handleInputChange("roomId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phòng" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id.toString()}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Thời gian bắt đầu *</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => handleInputChange("startTime", e.target.value)}
                min={(() => {
                  const tomorrow = new Date()
                  tomorrow.setDate(tomorrow.getDate() + 1)
                  return tomorrow.toISOString().slice(0, 16)
                })()}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceVip">Giá vé VIP *</Label>
                <Input
                  id="priceVip"
                  type="number"
                  value={formData.priceVip}
                  onChange={(e) => handleInputChange("priceVip", e.target.value)}
                  min="10000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceNormal">Giá vé thường *</Label>
                <Input
                  id="priceNormal"
                  type="number"
                  value={formData.priceNormal}
                  onChange={(e) => handleInputChange("priceNormal", e.target.value)}
                  min="10000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceEconomy">Giá vé tiết kiệm *</Label>
                <Input
                  id="priceEconomy"
                  type="number"
                  value={formData.priceEconomy}
                  onChange={(e) => handleInputChange("priceEconomy", e.target.value)}
                  min="10000"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

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
