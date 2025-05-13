"use client"

import { useState, useEffect, use } from "react"
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
import { roomsApi, Room } from "@/lib/api/rooms"
import { showtimesApi, Showtime, UpdateShowtimeParams } from "@/lib/api/showtimes"

export default function EditShowtimePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { id } = resolvedParams
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
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
  const [isEditable, setIsEditable] = useState(true) // State to control editability

  useEffect(() => {
    const loadData = async () => {
      try {
        const [showtimeData, eventsResponse, roomsResponse] = await Promise.all([
          showtimesApi.getShowtime(parseInt(id)),
          eventsApi.getEvents({ pageIndex: 1, pageSize: 100 }), // Fetch all events for dropdown
          roomsApi.getRooms({ PageIndex: 1, PageSize: 100 }) // Fetch all rooms for dropdown
        ])

        // Check if showtimeData has necessary properties before setting state
        if (eventsResponse.contends) {
           setEvents(eventsResponse.contends);
        }
       
        if (roomsResponse.contends) {
          setRooms(roomsResponse.contends);
        }
        
        if (showtimeData) {
             // Populate form with existing showtime data
            setFormData({
              startTime: showtimeData.startTime.substring(0, 16), // Format to datetime-local string
              priceVip: showtimeData.priceVip.toString(),
              priceNormal: showtimeData.priceNormal.toString(),
              priceEconomy: showtimeData.priceEconomy.toString(),
              eventId: showtimeData.eventId.toString(),
              roomId: showtimeData.roomId.toString(),
            })

            // Check if showtime has already started
            const now = new Date()
            const showtimeStartTime = new Date(showtimeData.startTime)
            if (showtimeStartTime <= now) {
              setIsEditable(false)
              toast({
                title: "Thông báo",
                description: "Xuất chiếu này đã bắt đầu hoặc kết thúc, không thể chỉnh sửa.",
                variant: "default", // Or a different variant if appropriate
              })
            }
        }

      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu xuất chiếu",
          variant: "destructive",
        })
        router.push("/admin/showtimes")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [id, router, toast])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const priceVip = parseInt(formData.priceVip)
      const priceNormal = parseInt(formData.priceNormal)
      const priceEconomy = parseInt(formData.priceEconomy)

      if (priceVip <= 10000 || priceNormal <= 10000 || priceEconomy <= 10000) {
        toast({
          title: "Lỗi",
          description: "Giá vé phải lớn hơn 10,000 VNĐ",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      const updatedShowtimeData: UpdateShowtimeParams = {
        startTime: new Date(formData.startTime).toISOString(),
        priceVip,
        priceNormal,
        priceEconomy,
        eventId: parseInt(formData.eventId),
        roomId: parseInt(formData.roomId),
      }

      await showtimesApi.updateShowtime(parseInt(id), updatedShowtimeData)

      toast({
        title: "Thành công",
        description: "Đã cập nhật xuất chiếu",
      })

      router.push(`/admin/showtimes/${id}`)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật xuất chiếu. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div>Đang tải...</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Link href={`/admin/showtimes/${id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa xuất chiếu</h1>
          <p className="text-muted-foreground">Cập nhật thông tin xuất chiếu</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin xuất chiếu</CardTitle>
            <CardDescription>Cập nhật thông tin cho xuất chiếu này</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isEditable && (
              <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md">
                Xuất chiếu này đã bắt đầu hoặc kết thúc và không thể chỉnh sửa.
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="eventId">Sự kiện *</Label>
              <Select value={formData.eventId} onValueChange={(value) => handleInputChange("eventId", value)} disabled={isSaving || isLoading || !isEditable}> {/* Disabled if not editable */}
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
              <Select value={formData.roomId} onValueChange={(value) => handleInputChange("roomId", value)} disabled={isSaving || isLoading || !isEditable}> {/* Disabled if not editable */}
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
                required
                disabled={isSaving || isLoading || !isEditable} /* Disabled if not editable */
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
                  disabled={isSaving || isLoading || !isEditable}
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
                  disabled={isSaving || isLoading || !isEditable}
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
                  disabled={isSaving || isLoading || !isEditable}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href={`/admin/showtimes/${id}`}>
            <Button type="button" variant="outline" disabled={isSaving || isLoading}> {/* This button is always enabled unless loading/saving */}
              Hủy
            </Button>
          </Link>
          <Button type="submit" disabled={isSaving || isLoading || !isEditable}> {/* Disabled if not editable */}
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </div>
  )
}
