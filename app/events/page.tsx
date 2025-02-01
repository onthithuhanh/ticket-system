import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function EventsPage() {
  // Dữ liệu mẫu cho các sự kiện
  const events = [
    {
      id: 1,
      title: "Vở Kịch: Lôi Vũ",
      image: "https://skda.edu.vn/wp-content/uploads/1-1-1.jpg",
      description: "Một vở kịch cảm động về tình yêu và sự hy sinh",
      date: "20/06/2023"
    },
    {
      id: 2,
      title: "Hòa Nhạc Mùa Hè",
      image: "https://skda.edu.vn/wp-content/uploads/3-170.jpg",
      description: "Chương trình hòa nhạc đặc sắc với các nghệ sĩ nổi tiếng",
      date: "25/06/2023"
    },
    {
      id: 3,
      title: "Vũ Điệu Mùa Xuân",
      image: "https://skda.edu.vn/wp-content/uploads/3-40.jpg",
      description: "Màn trình diễn múa đương đại đầy ấn tượng",
      date: "30/06/2023"
    },
    {
      id: 4,
      title: "Xiếc Đương Đại",
      image: "https://skda.edu.vn/wp-content/uploads/24.jpg",
      description: "Màn trình diễn xiếc hiện đại đầy mới lạ",
      date: "05/07/2023"
    },
    {
      id: 5,
      title: "Hòa Tấu Piano",
      image: "https://skda.edu.vn/wp-content/uploads/7-20.jpg",
      description: "Đêm nhạc piano với các nghệ sĩ quốc tế",
      date: "10/07/2023"
    },
    {
      id: 6,
      title: "Vũ Điệu Đương Đại",
      image: "https://kenh14cdn.com/203336854389633024/2023/11/4/photo-13-16990764216611822443761.jpg",
      description: "Chương trình múa đương đại đặc sắc",
      date: "15/07/2023"
    }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container-custom flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 m-auto">
        <section className="w-full py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tighter">Sự Kiện</h1>
                <p className="text-gray-500">Khám phá các sự kiện sắp diễn ra tại Nhà Hát Kịch</p>
              </div>
              <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
                <div className="flex items-center gap-2">
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Thể loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="drama">Kịch</SelectItem>
                      <SelectItem value="music">Âm nhạc</SelectItem>
                      <SelectItem value="dance">Múa</SelectItem>
                      <SelectItem value="circus">Xiếc</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Thời gian" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="today">Hôm nay</SelectItem>
                      <SelectItem value="tomorrow">Ngày mai</SelectItem>
                      <SelectItem value="week">Tuần này</SelectItem>
                      <SelectItem value="month">Tháng này</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative">
                  <Input type="search" placeholder="Tìm kiếm sự kiện..." className="w-full md:w-[300px]" />
                </div>
              </div>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <Card className="overflow-hidden transition-colors hover:bg-accent">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-[200px] w-full object-cover"
                    />
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {event.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {event.date}
                        </span>
                        <Button variant="outline" size="sm">
                          Xem chi tiết
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
