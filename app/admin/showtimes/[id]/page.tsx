"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Edit } from "lucide-react"
import { showtimesApi, Showtime } from "@/lib/api/showtimes"
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export default function ShowtimeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { id } = resolvedParams
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [showtime, setShowtime] = useState<Showtime | null>(null)

  useEffect(() => {
    const fetchShowtimeDetails = async () => {
      try {
        const showtimeData = await showtimesApi.getShowtime(parseInt(id))
        setShowtime(showtimeData)
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin xuất chiếu",
          variant: "destructive",
        })
        router.push("/admin/showtimes")
      } finally {
        setIsLoading(false)
      }
    }

    fetchShowtimeDetails()
  }, [id, router, toast])

  const formatDateTime = (isoString: string) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid Date';
    }
  };

  if (isLoading) {
    return <div>Đang tải...</div>
  }

  if (!showtime) {
    return <div>Không tìm thấy thông tin xuất chiếu</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/showtimes">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chi tiết xuất chiếu</h1>
            <p className="text-muted-foreground">Thông tin chi tiết về xuất chiếu</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/showtimes/${id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
          <CardDescription>Thông tin chi tiết về xuất chiếu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Sự kiện</h3>
              <p className="mt-1">{showtime.event?.name || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Phòng</h3>
              <p className="mt-1">{showtime.room?.name || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Thời gian bắt đầu</h3>
              <p className="mt-1">{formatDateTime(showtime.startTime)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Giá vé</CardTitle>
          <CardDescription>Chi tiết giá vé cho xuất chiếu này</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Giá vé VIP</h3>
              <p className="mt-1">{showtime.priceVip.toLocaleString()} VNĐ</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Giá vé Thường</h3>
              <p className="mt-1">{showtime.priceNormal.toLocaleString()} VNĐ</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Giá vé Tiết kiệm</h3>
              <p className="mt-1">{showtime.priceEconomy.toLocaleString()} VNĐ</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add more sections if API provides more details, e.g., seat map, status, etc. */}

    </div>
  )
} 