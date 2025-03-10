"use client"

import { useState, useEffect } from "react"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { eventsApi } from "@/lib/api/events"
import { useToast } from "@/hooks/use-toast"

export default function EventsPage() {
  const { toast } = useToast()
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [pageIndex, setPageIndex] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 6

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventsApi.getEvents({
          search,
          pageIndex,
          pageSize,
          category: category !== "all" ? category : undefined,
          isCancelled: false
        })
        setEvents(response.contends || [])
        setTotalPages(response.totalPages || 1)
      } catch (error: any) {
        toast({
          title: "Lỗi",
          description: error.response?.data?.message || "Không thể tải danh sách sự kiện",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [search, category, pageIndex, toast])

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

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
                  <Select value={category} onValueChange={setCategory}>
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
                </div>
                <div className="relative">
                  <Input 
                    type="search" 
                    placeholder="Tìm kiếm sự kiện..." 
                    className="w-full md:w-[300px]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {isLoading ? (
              <div className="mt-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {events.map((event) => (
                    <Link key={event.id} href={`/events/${event.id}`}>
                      <Card className="overflow-hidden transition-colors hover:bg-accent">
                        <img
                          src={event.thumbnail}
                          alt={event.name}
                          className="h-[200px] w-full object-cover"
                        />
                        <CardContent className="p-4">
                          <h3 className="text-lg font-semibold truncate" title={event.name}>
                            {event.name}
                          </h3>
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2" title={event.shortDescription}>
                            {event.shortDescription}
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                           <div></div>
                            <Button variant="outline" size="sm">
                              Xem chi tiết
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPageIndex((prev) => Math.max(prev - 1, 1))}
                      disabled={pageIndex === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={pageIndex === page ? "default" : "outline"}
                        onClick={() => setPageIndex(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPageIndex((prev) => Math.min(prev + 1, totalPages))}
                      disabled={pageIndex === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
