import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, Clock } from "lucide-react"

export function FeaturedEvents() {
  // Dữ liệu mẫu cho các sự kiện nổi bật
  const events = [
    {
      id: 1,
      title: "Vở Kịch: Lôi Vũ",
      description: "Một vở kịch cảm động về tình yêu và sự hy sinh",
      date: "20/06/2023",
      time: "19:30",
      location: "Sân khấu chính",
      category: "Kịch",
      image: "https://nld.mediacdn.vn/2020/3/2/13-kich-15831592557842103318677.jpg",
    },
    {
      id: 2,
      title: "Hòa Nhạc Mùa Hè",
      description: "Đêm nhạc cổ điển với những tác phẩm nổi tiếng",
      date: "25/06/2023",
      time: "20:00",
      location: "Sân khấu ngoài trời",
      category: "Âm nhạc",
      image: "https://nld.mediacdn.vn/2020/3/2/13-kich-15831592557842103318677.jpg",
    },
    {
      id: 3,
      title: "Múa Ballet: Hồ Thiên Nga",
      description: "Tác phẩm múa ballet kinh điển",
      date: "30/06/2023",
      time: "19:00",
      location: "Sân khấu chính",
      category: "Múa",
      image: "https://nld.mediacdn.vn/2020/3/2/13-kich-15831592557842103318677.jpg",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 m-auto;">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Sự Kiện Nổi Bật</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Khám phá những sự kiện đặc sắc sắp diễn ra tại Nhà Hát Kịch
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <img
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                width={600}
                height={400}
                className="aspect-video object-cover"
              />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge>{event.category}</Badge>
                </div>
                <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                <CardDescription className="line-clamp-2">{event.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2 text-sm">
                  <div className="flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 opacity-70" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 opacity-70" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/events/${event.id}`} className="w-full">
                  <Button className="w-full">Đặt Vé</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex justify-center">
          <Link href="/events">
            <Button variant="outline" size="lg">
              Xem Tất Cả Sự Kiện
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
