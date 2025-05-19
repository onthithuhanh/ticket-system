import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6 md:py-10">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">Nhà Hát Kịch</span>
          </Link>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © 2025 Nhà Hát Kịch. Tất cả các quyền được bảo lưu.
          </p>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
          <nav className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Giới Thiệu
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Liên Hệ
            </Link>
            
          </nav> 
        </div>
      </div>
    </footer>
  )
}
