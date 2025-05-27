import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-[#f8f9fa]">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Trải Nghiệm Nghệ Thuật Sân Khấu
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Đặt vé dễ dàng cho các buổi biểu diễn hàng đầu tại Nhà Hát Kịch. Khám phá các vở kịch, hòa nhạc và nhiều
                hơn nữa.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/events">
                <Button size="lg" className="px-8">
                  Xem Sự Kiện
                </Button>
              </Link>
              <Link href="/events">
                <Button size="lg" variant="outline" className="px-8">
                  Lịch Diễn
                </Button>
              </Link>
            </div>
          </div>
          <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last">
            <img
              alt="Nhà hát kịch"
              className="aspect-video object-cover"
              height={310}
              src="https://skda.edu.vn/wp-content/uploads/7-20.jpg"
              width={550}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
