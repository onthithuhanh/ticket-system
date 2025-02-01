"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Bell, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function UserNav() {
  const router = useRouter()
  const { toast } = useToast()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleLogout = () => {
    toast({
      title: "Đăng xuất thành công",
      description: "Hẹn gặp lại bạn!",
    })
    router.push("/login")
  }

  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:flex md:items-center md:gap-4">
        <Link href="/events">
          <Button variant="ghost">Sự kiện</Button>
        </Link>
        <Link href="/user/tickets">
          <Button variant="ghost">Vé của tôi</Button>
        </Link>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
              <AvatarFallback>NVA</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Nguyễn Văn A</p>
              <p className="text-xs leading-none text-muted-foreground">nguyenvana@example.com</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/user/profile" className="flex w-full">
              Hồ sơ
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/user/tickets" className="flex w-full">
              Vé của tôi
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/user/settings" className="flex w-full">
              Cài đặt
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-3.jpg" />
                <AvatarFallback>NVA</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Nguyễn Văn A</p>
                <p className="text-xs text-muted-foreground">nguyenvana@example.com</p>
              </div>
            </div>
            <nav className="grid gap-2">
              <Link href="/events">
                <Button variant="ghost" className="w-full justify-start">
                  Sự kiện
                </Button>
              </Link>
              <Link href="/user/tickets">
                <Button variant="ghost" className="w-full justify-start">
                  Vé của tôi
                </Button>
              </Link>
              <Link href="/user/profile">
                <Button variant="ghost" className="w-full justify-start">
                  Hồ sơ
                </Button>
              </Link>
              <Link href="/user/settings">
                <Button variant="ghost" className="w-full justify-start">
                  Cài đặt
                </Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
