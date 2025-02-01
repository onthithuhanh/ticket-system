"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Cài đặt hệ thống
  const [systemSettings, setSystemSettings] = useState({
    siteName: "Nhà Hát Kịch",
    siteDescription: "Hệ thống bán vé cho nhà hát kịch",
    contactEmail: "contact@theater.com",
    contactPhone: "0123456789",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    timezone: "Asia/Ho_Chi_Minh",
    currency: "VND",
    language: "vi",
  })

  // Cài đặt thanh toán
  const [paymentSettings, setPaymentSettings] = useState({
    enableCreditCard: true,
    enableBankTransfer: true,
    enableMomo: true,
    enableVnpay: true,
    vnpayMerchantId: "",
    vnpaySecretKey: "",
    momoPartnerCode: "",
    momoSecretKey: "",
    transactionFeePercent: 2.5,
    minimumAmount: 10000,
    maximumAmount: 50000000,
  })

  // Cài đặt email
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    fromEmail: "noreply@theater.com",
    fromName: "Nhà Hát Kịch",
    enableEmailNotifications: true,
    enableBookingConfirmation: true,
    enableEventReminders: true,
  })

  // Cài đặt bảo mật
  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireSpecialChars: true,
    enableCaptcha: true,
    enableSslOnly: true,
  })

  const handleSaveSystemSettings = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Đã lưu cài đặt hệ thống",
        description: "Cài đặt hệ thống đã được cập nhật thành công",
      })
    } catch (error) {
      toast({
        title: "Lỗi lưu cài đặt",
        description: "Đã xảy ra lỗi khi lưu cài đặt",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePaymentSettings = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Đã lưu cài đặt thanh toán",
        description: "Cài đặt thanh toán đã được cập nhật thành công",
      })
    } catch (error) {
      toast({
        title: "Lỗi lưu cài đặt",
        description: "Đã xảy ra lỗi khi lưu cài đặt",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveEmailSettings = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Đã lưu cài đặt email",
        description: "Cài đặt email đã được cập nhật thành công",
      })
    } catch (error) {
      toast({
        title: "Lỗi lưu cài đặt",
        description: "Đã xảy ra lỗi khi lưu cài đặt",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSecuritySettings = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Đã lưu cài đặt bảo mật",
        description: "Cài đặt bảo mật đã được cập nhật thành công",
      })
    } catch (error) {
      toast({
        title: "Lỗi lưu cài đặt",
        description: "Đã xảy ra lỗi khi lưu cài đặt",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cài đặt hệ thống</h1>
        <p className="text-muted-foreground">Quản lý cài đặt và cấu hình hệ thống</p>
      </div>

      <Tabs defaultValue="system" className="space-y-4">
        <TabsList>
          <TabsTrigger value="system">Hệ thống</TabsTrigger>
          <TabsTrigger value="payment">Thanh toán</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt hệ thống</CardTitle>
              <CardDescription>Cấu hình thông tin cơ bản của hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Tên website</Label>
                  <Input
                    id="siteName"
                    value={systemSettings.siteName}
                    onChange={(e) => setSystemSettings((prev) => ({ ...prev, siteName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email liên hệ</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={systemSettings.contactEmail}
                    onChange={(e) => setSystemSettings((prev) => ({ ...prev, contactEmail: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Mô tả website</Label>
                <Textarea
                  id="siteDescription"
                  value={systemSettings.siteDescription}
                  onChange={(e) => setSystemSettings((prev) => ({ ...prev, siteDescription: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Số điện thoại</Label>
                  <Input
                    id="contactPhone"
                    value={systemSettings.contactPhone}
                    onChange={(e) => setSystemSettings((prev) => ({ ...prev, contactPhone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Múi giờ</Label>
                  <Select
                    value={systemSettings.timezone}
                    onValueChange={(value) => setSystemSettings((prev) => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Ho_Chi_Minh">Việt Nam (UTC+7)</SelectItem>
                      <SelectItem value="Asia/Bangkok">Bangkok (UTC+7)</SelectItem>
                      <SelectItem value="Asia/Singapore">Singapore (UTC+8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Textarea
                  id="address"
                  value={systemSettings.address}
                  onChange={(e) => setSystemSettings((prev) => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Đơn vị tiền tệ</Label>
                  <Select
                    value={systemSettings.currency}
                    onValueChange={(value) => setSystemSettings((prev) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VND">Việt Nam Đồng (VND)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Ngôn ngữ</Label>
                  <Select
                    value={systemSettings.language}
                    onValueChange={(value) => setSystemSettings((prev) => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveSystemSettings} disabled={isLoading}>
                  {isLoading ? "Đang lưu..." : "Lưu cài đặt"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt thanh toán</CardTitle>
              <CardDescription>Cấu hình các phương thức thanh toán</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Phương thức thanh toán</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableCreditCard">Thẻ tín dụng/ghi nợ</Label>
                      <p className="text-sm text-muted-foreground">Cho phép thanh toán bằng thẻ</p>
                    </div>
                    <Switch
                      id="enableCreditCard"
                      checked={paymentSettings.enableCreditCard}
                      onCheckedChange={(checked) =>
                        setPaymentSettings((prev) => ({ ...prev, enableCreditCard: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableBankTransfer">Chuyển khoản ngân hàng</Label>
                      <p className="text-sm text-muted-foreground">Cho phép chuyển khoản trực tiếp</p>
                    </div>
                    <Switch
                      id="enableBankTransfer"
                      checked={paymentSettings.enableBankTransfer}
                      onCheckedChange={(checked) =>
                        setPaymentSettings((prev) => ({ ...prev, enableBankTransfer: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableMomo">Ví MoMo</Label>
                      <p className="text-sm text-muted-foreground">Thanh toán qua ví điện tử MoMo</p>
                    </div>
                    <Switch
                      id="enableMomo"
                      checked={paymentSettings.enableMomo}
                      onCheckedChange={(checked) => setPaymentSettings((prev) => ({ ...prev, enableMomo: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableVnpay">VNPay</Label>
                      <p className="text-sm text-muted-foreground">Thanh toán qua cổng VNPay</p>
                    </div>
                    <Switch
                      id="enableVnpay"
                      checked={paymentSettings.enableVnpay}
                      onCheckedChange={(checked) => setPaymentSettings((prev) => ({ ...prev, enableVnpay: checked }))}
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-medium mb-4">Cấu hình VNPay</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vnpayMerchantId">Merchant ID</Label>
                    <Input
                      id="vnpayMerchantId"
                      type="password"
                      value={paymentSettings.vnpayMerchantId}
                      onChange={(e) => setPaymentSettings((prev) => ({ ...prev, vnpayMerchantId: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vnpaySecretKey">Secret Key</Label>
                    <Input
                      id="vnpaySecretKey"
                      type="password"
                      value={paymentSettings.vnpaySecretKey}
                      onChange={(e) => setPaymentSettings((prev) => ({ ...prev, vnpaySecretKey: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-medium mb-4">Cấu hình MoMo</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="momoPartnerCode">Partner Code</Label>
                    <Input
                      id="momoPartnerCode"
                      type="password"
                      value={paymentSettings.momoPartnerCode}
                      onChange={(e) => setPaymentSettings((prev) => ({ ...prev, momoPartnerCode: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="momoSecretKey">Secret Key</Label>
                    <Input
                      id="momoSecretKey"
                      type="password"
                      value={paymentSettings.momoSecretKey}
                      onChange={(e) => setPaymentSettings((prev) => ({ ...prev, momoSecretKey: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-medium mb-4">Cài đặt giao dịch</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transactionFeePercent">Phí giao dịch (%)</Label>
                    <Input
                      id="transactionFeePercent"
                      type="number"
                      step="0.1"
                      value={paymentSettings.transactionFeePercent}
                      onChange={(e) =>
                        setPaymentSettings((prev) => ({
                          ...prev,
                          transactionFeePercent: Number.parseFloat(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minimumAmount">Số tiền tối thiểu (VNĐ)</Label>
                    <Input
                      id="minimumAmount"
                      type="number"
                      value={paymentSettings.minimumAmount}
                      onChange={(e) =>
                        setPaymentSettings((prev) => ({ ...prev, minimumAmount: Number.parseInt(e.target.value) }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maximumAmount">Số tiền tối đa (VNĐ)</Label>
                    <Input
                      id="maximumAmount"
                      type="number"
                      value={paymentSettings.maximumAmount}
                      onChange={(e) =>
                        setPaymentSettings((prev) => ({ ...prev, maximumAmount: Number.parseInt(e.target.value) }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSavePaymentSettings} disabled={isLoading}>
                  {isLoading ? "Đang lưu..." : "Lưu cài đặt"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt email</CardTitle>
              <CardDescription>Cấu hình SMTP và thông báo email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Cấu hình SMTP</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings((prev) => ({ ...prev, smtpHost: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings((prev) => ({ ...prev, smtpPort: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">Username</Label>
                    <Input
                      id="smtpUsername"
                      value={emailSettings.smtpUsername}
                      onChange={(e) => setEmailSettings((prev) => ({ ...prev, smtpUsername: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings((prev) => ({ ...prev, smtpPassword: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fromEmail">Email gửi</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings((prev) => ({ ...prev, fromEmail: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fromName">Tên người gửi</Label>
                    <Input
                      id="fromName"
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings((prev) => ({ ...prev, fromName: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-medium mb-4">Thông báo email</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableEmailNotifications">Bật thông báo email</Label>
                      <p className="text-sm text-muted-foreground">Gửi email thông báo cho khách hàng</p>
                    </div>
                    <Switch
                      id="enableEmailNotifications"
                      checked={emailSettings.enableEmailNotifications}
                      onCheckedChange={(checked) =>
                        setEmailSettings((prev) => ({ ...prev, enableEmailNotifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableBookingConfirmation">Xác nhận đặt vé</Label>
                      <p className="text-sm text-muted-foreground">Gửi email xác nhận khi đặt vé thành công</p>
                    </div>
                    <Switch
                      id="enableBookingConfirmation"
                      checked={emailSettings.enableBookingConfirmation}
                      onCheckedChange={(checked) =>
                        setEmailSettings((prev) => ({ ...prev, enableBookingConfirmation: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableEventReminders">Nhắc nhở sự kiện</Label>
                      <p className="text-sm text-muted-foreground">Gửi email nhắc nhở trước khi sự kiện diễn ra</p>
                    </div>
                    <Switch
                      id="enableEventReminders"
                      checked={emailSettings.enableEventReminders}
                      onCheckedChange={(checked) =>
                        setEmailSettings((prev) => ({ ...prev, enableEventReminders: checked }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveEmailSettings} disabled={isLoading}>
                  {isLoading ? "Đang lưu..." : "Lưu cài đặt"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt bảo mật</CardTitle>
              <CardDescription>Cấu hình các tính năng bảo mật hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Xác thực</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableTwoFactor">Xác thực hai yếu tố</Label>
                      <p className="text-sm text-muted-foreground">Bắt buộc xác thực 2FA cho admin</p>
                    </div>
                    <Switch
                      id="enableTwoFactor"
                      checked={securitySettings.enableTwoFactor}
                      onCheckedChange={(checked) =>
                        setSecuritySettings((prev) => ({ ...prev, enableTwoFactor: checked }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Thời gian hết hạn phiên (phút)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) =>
                          setSecuritySettings((prev) => ({ ...prev, sessionTimeout: Number.parseInt(e.target.value) }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxLoginAttempts">Số lần đăng nhập tối đa</Label>
                      <Input
                        id="maxLoginAttempts"
                        type="number"
                        value={securitySettings.maxLoginAttempts}
                        onChange={(e) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            maxLoginAttempts: Number.parseInt(e.target.value),
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-medium mb-4">Mật khẩu</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="passwordMinLength">Độ dài tối thiểu</Label>
                      <Input
                        id="passwordMinLength"
                        type="number"
                        value={securitySettings.passwordMinLength}
                        onChange={(e) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            passwordMinLength: Number.parseInt(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="requireSpecialChars">Yêu cầu ký tự đặc biệt</Label>
                        <p className="text-sm text-muted-foreground">Bắt buộc có ký tự đặc biệt trong mật khẩu</p>
                      </div>
                      <Switch
                        id="requireSpecialChars"
                        checked={securitySettings.requireSpecialChars}
                        onCheckedChange={(checked) =>
                          setSecuritySettings((prev) => ({ ...prev, requireSpecialChars: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-medium mb-4">Bảo mật khác</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableCaptcha">Bật CAPTCHA</Label>
                      <p className="text-sm text-muted-foreground">Hiển thị CAPTCHA khi đăng nhập</p>
                    </div>
                    <Switch
                      id="enableCaptcha"
                      checked={securitySettings.enableCaptcha}
                      onCheckedChange={(checked) =>
                        setSecuritySettings((prev) => ({ ...prev, enableCaptcha: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableSslOnly">Chỉ cho phép HTTPS</Label>
                      <p className="text-sm text-muted-foreground">Bắt buộc sử dụng kết nối SSL</p>
                    </div>
                    <Switch
                      id="enableSslOnly"
                      checked={securitySettings.enableSslOnly}
                      onCheckedChange={(checked) =>
                        setSecuritySettings((prev) => ({ ...prev, enableSslOnly: checked }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveSecuritySettings} disabled={isLoading}>
                  {isLoading ? "Đang lưu..." : "Lưu cài đặt"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
