"use client"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Implement contact form submission
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
      toast({
        title: "Thành công",
        description: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.",
      })
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

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
                Liên hệ với chúng tôi
              </h1>
              <p className="mb-8 text-lg text-gray-100">
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container-custom">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <div>
                <h2 className="mb-6 text-3xl font-bold">Gửi tin nhắn</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Họ và tên *
                      </label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Nhập email"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Số điện thoại
                    </label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Tiêu đề *
                    </label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="Nhập tiêu đề"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Nội dung *
                    </label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Nhập nội dung tin nhắn"
                      rows={6}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Đang gửi..." : "Gửi tin nhắn"}
                  </Button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="mb-6 text-3xl font-bold">Thông tin liên hệ</h2>
                  <p className="text-muted-foreground">
                    Chúng tôi luôn sẵn sàng hỗ trợ và giải đáp mọi thắc mắc của bạn.
                    Hãy liên hệ với chúng tôi qua các kênh sau:
                  </p>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <MapPin className="mt-1 h-5 w-5 text-purple-600" />
                        <div>
                          <h3 className="font-semibold">Địa chỉ</h3>
                          <p className="mt-1 text-muted-foreground">
                            69 Nguyễn Du, Quận 1<br />
                            TP. Hồ Chí Minh
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Phone className="mt-1 h-5 w-5 text-blue-600" />
                        <div>
                          <h3 className="font-semibold">Điện thoại</h3>
                          <p className="mt-1 text-muted-foreground">
                            (028) 3824 3014<br />
                            Hotline: 1900 1234
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Mail className="mt-1 h-5 w-5 text-green-600" />
                        <div>
                          <h3 className="font-semibold">Email</h3>
                          <p className="mt-1 text-muted-foreground">
                            info@nhahatkich.vn<br />
                            booking@nhahatkich.vn
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Clock className="mt-1 h-5 w-5 text-yellow-600" />
                        <div>
                          <h3 className="font-semibold">Giờ làm việc</h3>
                          <p className="mt-1 text-muted-foreground">
                            Thứ 2 - Thứ 6: 8:00 - 20:00<br />
                            Thứ 7 - Chủ nhật: 9:00 - 18:00
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background">
        <div className="container-custom py-8">
          <div className="text-center text-sm text-muted-foreground">
            © 2024 Nhà Hát Kịch Việt Nam. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
} 