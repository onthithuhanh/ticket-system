"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Calendar, Users, TicketCheck, Settings, Menu, ChartColumnStacked, BookCopy } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useMobile()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/login')
      return
    }

    const userData = JSON.parse(storedUser)
    if (!userData.isActive || userData.isDeleted) {
      router.push('/login')
      return
    }

    setUser(userData)
  }, [router])

  if (!user) {
    return null // or a loading spinner
  }

  const routes = [
    {
      icon: LayoutDashboard,
      label: "Tổng quan",
      href: "/admin/dashboard",
    },
    {
      icon: Calendar,
      label: "Quản lý sự kiện",
      href: "/admin/events",
    },
    {
      icon: Users,
      label: "Quản lý người dùng",
      href: "/admin/users",
    },
    // {
    //   icon: ChartColumnStacked,
    //   label: "Quản lý thể loại",
    //   href: "/admin/categories",
    // },
    {
      icon: BookCopy,
      label: "Quản lý phòng",
      href: "/admin/rooms",
    },
    {
      icon: TicketCheck,
      label: "Quản lý vé",
      href: "/admin/tickets",
    }, {
      icon: TicketCheck,
      label: "Quản giao dịch",
      href: "/admin/transactions",
    },
    {
      icon: Calendar,
      label: "Check in vé",
      href: "/admin/check-in",
    },
    {
      icon: Calendar,
      label: "Quản lý xuất chiếu",
      href: "/admin/showtimes",
    },
    {
      icon: Calendar,
      label: "Quản lý tiện nghi",
      href: "/admin/amenities",
    },
    // {
    //   icon: Settings,
    //   label: "Cài đặt",
    //   href: "/admin/settings",
    // },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center border-b bg-background px-4">
        <div className="flex items-center gap-2 md:gap-4">
          {isMobile && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <nav className="grid gap-2 text-lg font-medium">
                  {routes.map((route, i) => (
                    <Link
                      key={i}
                      href={route.href}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent ${pathname === route.href ? "bg-accent" : ""
                        }`}
                      onClick={() => setOpen(false)}
                    >
                      <route.icon className="h-5 w-5" />
                      {route.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          )}
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="text-lg font-bold">Quản Trị Nhà Hát</span>
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl || "/placeholder.svg?height=32&width=32"} alt="Avatar" />
                  <AvatarFallback>{user.userName?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.userName}</p>
                  {/* <p className="text-xs leading-none text-muted-foreground">{user.email}</p> */}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>
                <Link href="/admin/profile" className="flex w-full">
                  Hồ sơ
                </Link>
              </DropdownMenuItem> */}
              {/* <DropdownMenuItem>
                <Link href="/admin/settings" className="flex w-full">
                  Cài đặt
                </Link>
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                localStorage.removeItem('user')
                router.push('/login')
              }}>
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="flex flex-1">
        {!isMobile && (
          <aside className="w-64 border-r bg-background">
            <nav className="grid gap-2 p-4 text-sm font-medium">
              {routes.map((route, i) => (
                <Link
                  key={i}
                  href={route.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent ${pathname === route.href ? "bg-accent" : ""
                    }`}
                >
                  <route.icon className="h-5 w-5" />
                  {route.label}
                </Link>
              ))}
            </nav>
          </aside>
        )}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
