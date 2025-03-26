"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { eventsApi } from "@/lib/api/events"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { use } from "react"

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [event, setEvent] = useState<any>(null)
  const resolvedParams = use(params)
  const { id } = resolvedParams

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventsApi.getEvent(parseInt(id))
        setEvent(response)
      } catch (error: any) {
        toast({
          title: "Lỗi",
          description: error.response?.data?.message || "Không thể tải thông tin vở kịch",
          variant: "destructive",
        })
        router.push("/admin/events")
      }
    }

    fetchEvent()
  }, [id, router, toast])

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await eventsApi.deleteEvent(parseInt(id))
      toast({
        title: "Thành công",
        description: "Đã xóa vở kịch thành công",
      })
      router.push("/admin/events")
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Đã xảy ra lỗi khi xóa vở kịch",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case "Drame":
        return "Kịch"
      case "Music":
        return "Âm nhạc"
      case "Dance":
        return "Múa"
      case "Circus":
        return "Xiếc"
      case "Comedy":
        return "Hài kịch"
      case "Opera":
        return "Opera"
      default:
        return category
    }
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/events">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{event.name}</h1>
            <p className="text-muted-foreground">Chi tiết vở kịch</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/events/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa vở kịch này? Hành động này không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
                  {isLoading ? "Đang xóa..." : "Xóa"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>Thông tin chi tiết về vở kịch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Thể loại123</h3>
                  <p className="mt-1">{getCategoryText(event.category)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Thời lượng</h3>
                  <p className="mt-1">{event.duration} phút</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Mô tả ngắn</h3>
                <p className="mt-1">{event.shortDescription}</p>
              </div>
              {event.detailedDescription && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Mô tả chi tiết</h3>
                  <p className="mt-1 whitespace-pre-line">{event.detailedDescription}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin sản xuất</CardTitle>
              <CardDescription>Thông tin về đạo diễn và diễn viên</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Đạo diễn</h3>
                <p className="mt-1">{event.director}</p>
              </div>
              {event.actors && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Diễn viên</h3>
                  <p className="mt-1 whitespace-pre-line">{event.actors}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái</CardTitle>
              <CardDescription>Trạng thái hiện tại của vở kịch</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant={event.isCancelled ? "destructive" : "default"}>
                {event.isCancelled ? "Đã ẩn" : "Hiệu lực"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hình ảnh</CardTitle>
              <CardDescription>Poster và hình ảnh vở kịch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {event.thumbnail && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Poster</h3>
                  <img
                    src={event.thumbnail}
                    alt="Poster"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              {event.eventImages && event.eventImages.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Hình ảnh khác</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {event.eventImages.map((image: any, index: number) => (
                      <img
                        key={index}
                        src={image.imageUrl}
                        alt={`Hình ảnh ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
