"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { ArrowLeft, CreditCard, Wallet } from "lucide-react"
import Link from "next/link"

interface Ticket {
  price: number
  qrCode: string
  isUsed: boolean
  seatId: number
}

interface User {
  id: string
  userName: string
  email: string
  emailConfirmed: boolean
  phoneNumber: string
  phoneNumberConfirmed: boolean
  fullName: string
  avatarUrl: string
  isActive: boolean
  isDeleted: boolean
  roles: string[]
}

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"VnPay" | "Momo">("VnPay")
  const [user, setUser] = useState<User | null>(null)

  // Lấy dữ liệu từ URL parameters
  const scheduleId = searchParams.get("scheduleId")
  const selectedSeats = JSON.parse(searchParams.get("seats") || "[]")
  const totalPrice = Number(searchParams.get("totalPrice") || "0")
  const eventName = searchParams.get("eventName")
  const showtime = searchParams.get("showtime")

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const userData = JSON.parse(userStr)
      setUser(userData)
    }
  }, [])

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đăng nhập để tiếp tục",
        variant: "destructive",
      })
      return
    }

    if (!user.email) {
      toast({
        title: "Thông báo",
        description: "Vui lòng cập nhật email trong trang cá nhân để tiếp tục",
      })
      router.push("/user/profile")
      return
    }

    if (!scheduleId || selectedSeats.length === 0) {
      toast({
        title: "Lỗi",
        description: "Thiếu thông tin đặt vé",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const tickets: Ticket[] = selectedSeats.map((seat: any) => ({
        price: seat.price,
        qrCode: "", // Sẽ được tạo bởi server
        isUsed: false,
        seatId: seat.id
      }))

      const returnUrl = `${window.location.origin}/order`
      const response = await fetch(`https://stellaway.runasp.net/api/Payments/pay?returnUrl=${encodeURIComponent(returnUrl)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          totalPrice,
          method: paymentMethod,
          userId: user.id,
          scheduleId: Number(scheduleId),
          tickets
        })
      })

      if (!response.ok) {
        throw new Error("Thanh toán thất bại")
      }

      const paymentUrl = await response.text()
      
      // Chuyển hướng đến URL thanh toán
      if (paymentUrl) {
        window.location.href = paymentUrl
      } else {
        throw new Error("Không nhận được URL thanh toán")
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xử lý thanh toán. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
        <div className="container px-4 py-8 m-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/events">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Thanh toán</h1>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin đặt vé</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Vở kịch</h3>
                    <p className="mt-1">{eventName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Thời gian</h3>
                    <p className="mt-1">{showtime}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Ghế đã chọn</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedSeats.map((seat: any) => (
                        <div key={seat.id} className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                          Ghế {seat.id} - {seat.category}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Tổng tiền:</span>
                      <span className="text-lg font-semibold">{totalPrice.toLocaleString('vi-VN')}đ</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Phương thức thanh toán</CardTitle>
                  <CardDescription>Chọn phương thức thanh toán phù hợp với bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as "VnPay" | "Momo")}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="VnPay" id="vnpay" />
                      <Label htmlFor="vnpay" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        VNPay
                      </Label>
                    </div>
                    {/* <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Momo" id="momo" />
                      <Label htmlFor="momo" className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        MoMo
                      </Label>
                    </div> */}
                  </RadioGroup>
                </CardContent>
              </Card>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handlePayment}
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Thanh toán"}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 