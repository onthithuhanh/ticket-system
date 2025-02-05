"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, MapPin, Users, X } from "lucide-react"
import { eventsApi } from "@/lib/api/events"
import { useToast } from "@/hooks/use-toast"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [event, setEvent] = useState<any>(null)
  const [selectedShowtime, setSelectedShowtime] = useState<string>("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showSeatSelection, setShowSeatSelection] = useState(false)
  const resolvedParams = use(params)
  const { id } = resolvedParams

  // Mock data for showtimes - sẽ được thay thế bằng API thực tế
  const showtimes = [
    { id: 1, time: "19:00", date: "2024-03-20" },
    { id: 2, time: "20:00", date: "2024-03-20" },
    { id: 3, time: "19:00", date: "2024-03-21" },
    { id: 4, time: "20:00", date: "2024-03-21" },
  ]

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
        router.push("/events")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvent()
  }, [id, router, toast])

  const handleShowtimeSelect = (showtimeId: string) => {
    setSelectedShowtime(showtimeId)
  }

  const handleBookTickets = () => {
    if (!selectedShowtime) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn giờ xuất chiếu",
        variant: "destructive",
      })
      return
    }
    setShowSeatSelection(true)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background">
          <div className="container-custom flex h-16 items-center">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </main>
      </div>
    )
  }

  if (!event) return null

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container-custom flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container px-4 py-8   m-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/events">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">{event.name}</h1>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <Card>
                <img
                  src={event.thumbnail}
                  alt={event.name}
                  className="w-full h-[400px] object-cover cursor-pointer"
                  onClick={() => setSelectedImage(event.thumbnail)}
                />
                <CardContent className="p-6">
                  <div className="space-y-4">
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
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thông tin sản xuất</CardTitle>
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
                  <CardTitle>Đặt vé</CardTitle>
                  <CardDescription>Chọn giờ xuất chiếu để tiếp tục</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500">Chọn giờ xuất chiếu</h3>
                    <div className="grid gap-4">
                      {showtimes.map((showtime) => (
                        <Button
                          key={showtime.id}
                          variant={selectedShowtime === showtime.id.toString() ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => handleShowtimeSelect(showtime.id.toString())}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {showtime.date}
                          <Clock className="ml-4 mr-2 h-4 w-4" />
                          {showtime.time}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleBookTickets}
                    disabled={!selectedShowtime}
                  >
                    Tiếp tục chọn ghế
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thông tin chi tiết</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Thời lượng</p>
                      <p className="text-sm text-gray-500">{event.duration} phút</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Thể loại</p>
                      <p className="text-sm text-gray-500">{event.category}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Image Gallery Section */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Hình ảnh</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">Tất cả</TabsTrigger>
                    <TabsTrigger value="poster">Poster</TabsTrigger>
                    <TabsTrigger value="scene">Cảnh quay</TabsTrigger>
                    <TabsTrigger value="behind">Hậu trường</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <img
                        src={event.thumbnail}
                        alt="Thumbnail"
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedImage(event.thumbnail)}
                      />
                      {event.eventImages?.map((image: { imageUrl: string }, index: number) => (
                        <img
                          key={index}
                          src={image.imageUrl}
                          alt={`Image ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setSelectedImage(image.imageUrl)}
                        />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="poster" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <img
                        src={event.thumbnail}
                        alt="Poster"
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedImage(event.thumbnail)}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="scene" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {event.images?.slice(0, 4).map((image: string, index: number) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Scene ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setSelectedImage(image)}
                        />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="behind" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {event.images?.slice(4).map((image: string, index: number) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Behind the scenes ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setSelectedImage(image)}
                        />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Xem ảnh</span>
              <Button variant="ghost" size="icon" onClick={() => setSelectedImage(null)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Seat Selection Dialog */}
      <Dialog open={showSeatSelection} onOpenChange={setShowSeatSelection}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chọn ghế</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {/* TODO: Thêm component chọn ghế ở đây */}
            <p>Component chọn ghế sẽ được thêm vào đây</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
