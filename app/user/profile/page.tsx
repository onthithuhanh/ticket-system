"use client"

import { useState, useEffect, useRef } from "react"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { userApi } from "@/lib/api/user"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase/config"

const profileSchema = z.object({
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  fullName: z.string().min(1, "Họ và tên không được để trống"),
  phoneNumber: z.string().optional().or(z.literal("")),
  avatarUrl: z.string().optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  const avatarUrl = watch("avatarUrl")

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userStr = localStorage.getItem("user")
        if (userStr) {
          const userData = JSON.parse(userStr)
          setUser(userData)
          setPreviewImage(userData.avatarUrl || null)
          reset({
            email: userData.email || "",
            fullName: userData.fullName || "",
            phoneNumber: userData.phoneNumber || "",
            avatarUrl: userData.avatarUrl || "",
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserData()
  }, [reset])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      
      // Tạo reference đến Firebase Storage
      const storageRef = ref(storage, `avatars/${user.id}/${file.name}`)
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file)
      
      // Lấy URL của ảnh đã upload
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      // Cập nhật preview và form
      setPreviewImage(downloadURL)
      setValue("avatarUrl", downloadURL)
      
      toast({
        title: "Upload ảnh thành công",
        description: "Ảnh đại diện đã được cập nhật",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Lỗi upload ảnh",
        description: "Đã xảy ra lỗi khi upload ảnh",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      const response = await userApi.updateUser(user.id, {
        ...data,
        isActive: true
      })
      
      // Cập nhật localStorage với thông tin mới
      const updatedUser = { ...user, ...data }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
      console.log(3333,updatedUser);
      
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân đã được cập nhật",
      })
    } catch (error: any) {
      toast({
        title: "Lỗi cập nhật",
        description: error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật thông tin",
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
        <div className="container-custom py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Tài khoản của tôi</h1>
            <p className="mt-2 text-muted-foreground">Quản lý thông tin cá nhân và tài khoản</p>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <Card className="p-4">
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={previewImage || "/placeholder.svg"} alt={user?.fullName || user?.userName} />
                      <AvatarFallback>{(user?.fullName || user?.userName || "U")[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                      >
                        {uploadingImage ? "Đang upload..." : "Thay đổi ảnh"}
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG hoặc GIF. Tối đa 2MB
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input 
                      id="fullName" 
                      {...register("fullName")}
                      placeholder="Nhập họ và tên"
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-500">{errors.fullName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      {...register("email")}
                      placeholder="Nhập email"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Số điện thoại</Label>
                    <Input 
                      id="phoneNumber" 
                      {...register("phoneNumber")}
                      placeholder="Nhập số điện thoại"
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
                    )}
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Đang cập nhật..." : "Cập nhật thông tin"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardHeader>
                <CardTitle>Bảo mật</CardTitle>
                <CardDescription>Quản lý mật khẩu và bảo mật tài khoản</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Mật khẩu mới</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button type="submit">Đổi mật khẩu</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
} 