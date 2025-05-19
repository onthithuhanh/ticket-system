"use client"

import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Theater, Users, Ticket, Star, Building2, Clock, MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container-custom flex h-16 items-center">
          <MainNav />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="container-custom py-20">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
                Nhà Hát Kịch Việt Nam
              </h1>
              <p className="mb-8 text-lg text-gray-100">
                Nơi kết nối nghệ thuật với công chúng, mang đến những trải nghiệm văn hóa đặc sắc
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/events">
                  <Button size="lg" variant="secondary">
                    Xem lịch diễn
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="bg-transparent text-white hover:bg-white/10">
                    Liên hệ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20">
          <div className="container-custom">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="mb-6 text-3xl font-bold">Về Nhà Hát</h2>
                <p className="mb-4 text-muted-foreground">
                  Nhà Hát Kịch Việt Nam là một trong những đơn vị nghệ thuật hàng đầu, chuyên tổ chức và biểu diễn các vở kịch, 
                  nhạc kịch và các chương trình nghệ thuật đặc sắc. Với sứ mệnh bảo tồn và phát triển nghệ thuật sân khấu, 
                  chúng tôi luôn nỗ lực mang đến những tác phẩm chất lượng cao cho khán giả.
                </p>
                <p className="mb-4 text-muted-foreground">
                  Hệ thống quản lý nhà hát của chúng tôi được thiết kế để mang lại trải nghiệm tốt nhất cho cả khán giả và 
                  đội ngũ quản lý, từ việc đặt vé trực tuyến đến quản lý sự kiện một cách chuyên nghiệp.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-purple-600" />
                    <span>3 Sân khấu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span>50+ Vở diễn/năm</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video overflow-hidden rounded-lg">
                  <img
                    src="https://skda.edu.vn/wp-content/uploads/7-20.jpg"
                    alt="Nhà hát"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-20">
          <div className="container-custom">
            <h2 className="mb-12 text-center text-3xl font-bold">Dịch vụ của chúng tôi</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <Theater className="mb-4 h-12 w-12 text-purple-600" />
                  <h3 className="mb-2 text-xl font-semibold">Kịch nói</h3>
                  <p className="text-muted-foreground">
                    Các vở kịch đương đại và cổ điển được dàn dựng công phu
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Ticket className="mb-4 h-12 w-12 text-blue-600" />
                  <h3 className="mb-2 text-xl font-semibold">Đặt vé online</h3>
                  <p className="text-muted-foreground">
                    Hệ thống đặt vé trực tuyến 24/7, thanh toán an toàn
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Users className="mb-4 h-12 w-12 text-green-600" />
                  <h3 className="mb-2 text-xl font-semibold">Sự kiện đặc biệt</h3>
                  <p className="text-muted-foreground">
                    Tổ chức các sự kiện văn hóa và giao lưu nghệ thuật
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="container-custom">
            <h2 className="mb-12 text-center text-3xl font-bold">Thông tin liên hệ</h2>
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
              <Card>
                <CardContent className="p-6 text-center">
                  <MapPin className="mx-auto mb-4 h-8 w-8 text-purple-600" />
                  <h3 className="mb-2 font-semibold">Địa chỉ</h3>
                  <p className="text-muted-foreground">
                    69 Nguyễn Du, Quận 1<br />
                    TP. Hồ Chí Minh
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Phone className="mx-auto mb-4 h-8 w-8 text-blue-600" />
                  <h3 className="mb-2 font-semibold">Điện thoại</h3>
                  <p className="text-muted-foreground">
                    (028) 3824 3014<br />
                    Hotline: 1900 1234
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Mail className="mx-auto mb-4 h-8 w-8 text-green-600" />
                  <h3 className="mb-2 font-semibold">Email</h3>
                  <p className="text-muted-foreground">
                    info@nhahatkich.vn<br />
                    booking@nhahatkich.vn
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background">
        <div className="container-custom py-8">
          <div className="text-center text-sm text-muted-foreground">
            © 2025 Nhà Hát Kịch Việt Nam.
          </div>
        </div>
      </footer>
    </div>
  )
} 