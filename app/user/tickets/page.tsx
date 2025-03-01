"use client"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, MapPin, Clock, Ticket, Download } from "lucide-react"
import Link from "next/link"

export default function UserTicketsPage() {
  // Dữ liệu mẫu cho danh sách vé
  const tickets = [
    {
      id: "TICKET-001",
      eventTitle: "Vở Kịch: Lôi Vũ",
      date: "20/06/2023",
      time: "19:30",
      location: "Sân khấu chính",
      seats: ["VIP-5", "VIP-6"],
      totalAmount: 1000000,
      status: "confirmed",
      qrCode: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "TICKET-002",
      eventTitle: "Hòa Nhạc Mùa Hè",
      date: "25/06/2023",
      time: "20:00",
      location: "Sân khấu ngoài trời",
      seats: ["STD-15"],
      totalAmount: 300000,
      status: "pending",
      qrCode: "/placeholder.svg?height=200&width=200",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Đã xác nhận</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Chờ xử lý</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Đã hủy</Badge>
      default:
        return <Badge>Không xác định</Badge>
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container-custom flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container-custom py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Vé của tôi</h1>
            <p className="mt-2 text-muted-foreground">Quản lý và xem thông tin vé của bạn</p>
          </div>

          <Tabs defaultValue="upcoming" className="mt-8">
            <div className="flex justify-center">
              <TabsList>
                <TabsTrigger value="upcoming">Sắp tới</TabsTrigger>
                <TabsTrigger value="past">Đã qua</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="upcoming" className="mt-6">
              <div className="grid gap-6">
                {tickets.map((ticket) => (
                  <Card key={ticket.id} className="p-4">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{ticket.eventTitle}</CardTitle>
                          <CardDescription>Mã vé: {ticket.id}</CardDescription>
                        </div>
                        {getStatusBadge(ticket.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <span>{ticket.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{ticket.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{ticket.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Ticket className="h-4 w-4 text-muted-foreground" />
                            <span>{ticket.seats.join(", ")}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Tổng tiền</p>
                            <p className="text-2xl font-bold">{ticket.totalAmount.toLocaleString()}đ</p>
                          </div>
                          <Button variant="outline" className="mt-4">
                            <Download className="mr-2 h-4 w-4" />
                            Tải vé
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="past" className="mt-6">
              <div className="text-center text-muted-foreground">Chưa có vé nào</div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
} 