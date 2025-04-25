import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Clock, Ticket } from "lucide-react"
import { showtimesApi, Showtime } from "@/lib/api/showtimes"
import Link from "next/link"

export function UpcomingShowtimes() {
  const [showtimes, setShowtimes] = useState<Showtime[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const response = await showtimesApi.getShowtimes({
          pageIndex: 1,
          pageSize: 10,
          StartTimeFrom: new Date().toISOString().split('T')[0]
        })
        setShowtimes(response.contends)
      } catch (error) {
        console.error("Error fetching showtimes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchShowtimes()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 m-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Lịch Chiếu Sắp Tới</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Khám phá các buổi diễn sắp tới tại Nhà Hát Kịch
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {showtimes.map((showtime) => (
            <Card key={showtime.id} className="overflow-hidden">
              {showtime.event?.thumbnail && (
                <img
                  src={showtime.event.thumbnail}
                  alt={showtime.event.name}
                  width={600}
                  height={400}
                  className="aspect-video object-cover"
                />
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge>{showtime.event?.category}</Badge>
                </div>
                <CardTitle className="line-clamp-1">{showtime.event?.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  Phòng: {showtime.room?.name} - Sức chứa: {showtime.room?.capacity} người
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2 text-sm">
                  <div className="flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                    <span>{new Date(showtime.startTime).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 opacity-70" />
                    <span>{new Date(showtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center">
                    <Ticket className="mr-2 h-4 w-4 opacity-70" />
                    <span>Giá vé: {showtime.priceNormal.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/showtimes/${showtime.id}`} className="w-full">
                  <Button className="w-full">Đặt Vé</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 