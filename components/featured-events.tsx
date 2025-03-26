"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, Clock, Users, Info } from "lucide-react"
import { showtimesApi, Showtime } from "@/lib/api/showtimes"

export function FeaturedEvents() {
  const [showtimes, setShowtimes] = useState<Showtime[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const response = await showtimesApi.getShowtimes({
          pageIndex: 1,
          pageSize: 9,
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

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32  ">
      <div className="container px-4 md:px-6 m-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Sự Kiện Nổi Bật</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Khám phá những sự kiện đặc sắc sắp diễn ra tại Nhà Hát Kịch
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {showtimes.map((showtime) => (
            <Card key={showtime.id} className="overflow-hidden">
              {showtime.event?.eventImages?.[0]?.imageUrl && (
                <img
                  src={showtime.event.eventImages[0].imageUrl}
                  alt={showtime.event.name}
                  width={600}
                  height={400}
                  className="aspect-video object-cover"
                />
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge>{showtime.event?.category ? getCategoryText(showtime.event.category) : ''}</Badge>
                  
                </div>
                <CardTitle className="line-clamp-1">{showtime.event?.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {showtime.event?.shortDescription}
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
                    <MapPin className="mr-2 h-4 w-4 opacity-70" />
                    <span>{showtime.room?.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 opacity-70" />
                    <span>Sức chứa: {showtime.room?.capacity} người</span>
                  </div>
                  {showtime.room?.roomAmenities && showtime.room.roomAmenities.length > 0 && (
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 opacity-70" />
                      <span className="flex flex-wrap gap-1">
                        {showtime.room.roomAmenities.map((amenity) => (
                          <Badge key={amenity.amenityId} variant="secondary" className="text-xs">
                            {amenity.amenity.name}
                          </Badge>
                        ))}
                      </span>
                    </div>
                  )}
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded bg-gray-100 p-1 text-center">
                      <div className="font-semibold">VIP</div>
                      <div>{showtime.priceVip.toLocaleString('vi-VN')}đ</div>
                    </div>
                    <div className="rounded bg-gray-100 p-1 text-center">
                      <div className="font-semibold">Thường</div>
                      <div>{showtime.priceNormal.toLocaleString('vi-VN')}đ</div>
                    </div>
                    <div className="rounded bg-gray-100 p-1 text-center">
                      <div className="font-semibold">Tiết kiệm</div>
                      <div>{showtime.priceEconomy.toLocaleString('vi-VN')}đ</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/events/${showtime.eventId}`} className="w-full">
                  <Button className="w-full"  >
                  Đặt Vé
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex justify-center">
          <Link href="/events">
            <Button variant="outline" size="lg">
              Xem Tất Cả Lịch Chiếu
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
