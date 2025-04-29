"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"

export default function OrderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null)
  const [message, setMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const success = searchParams.get("isSuccess")
      const msg = searchParams.get("message")

      if (!success) {
        throw new Error("Thiếu thông tin đơn hàng")
      }

      setIsSuccess(success === "True")
      setMessage(msg || (success === "True" ? "Thanh toán thành công" : "Thanh toán thất bại"))
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin đơn hàng",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [searchParams, toast])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background">
          <div className="container-custom flex h-16 items-center">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </main>
      </div>
    )
  }

  if (isSuccess === null) return null

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
            <h1 className="text-3xl font-bold tracking-tight">Xác nhận đơn hàng</h1>
          </div>

          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  {isSuccess ? (
                    <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                  ) : (
                    <XCircle className="h-16 w-16 text-red-500 mb-4" />
                  )}
                  <h2 className="text-2xl font-semibold mb-2">
                    {isSuccess ? "Thanh toán thành công" : "Thanh toán thất bại"}
                  </h2>
                  <p className="text-gray-500 mb-6">{message}</p>
                  <Link href="/user/tickets">
                    <Button>Xem vé của tôi</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 