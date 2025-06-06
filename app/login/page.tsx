"use client"

import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api/auth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { toast } from "sonner" 
import { signIn } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
const loginSchema = z.object({
  username: z.string().min(1, "Tên đăng nhập không được để trống"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      const response = await authApi.login(data)
      console.log(response)
      localStorage.setItem("user", JSON.stringify(response)) 
 
      toast({
        title: "Đăng nhập thành công",
        description: "Bạn có thể sử dụng dịch vụ",
      })
      // Check if user has admin role
      if (response.userName?.includes("admin")) {
        router.push("/admin/dashboard")
      } else {
        router.push("/")
      }
    } catch (error: any) {
      toast({
        title: "Đăng nhập không  thành công",
        description: "Tài khoản hoặc mật khẩu sai",
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
        <div className="container-custom flex h-[calc(100vh-4rem)] items-center justify-center">
          <Card className="w-full max-w-[400px]">
            <CardHeader>
              <CardTitle>Đăng nhập</CardTitle>
              <CardDescription>
                Đăng nhập để truy cập vào tài khoản của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="username">Tên đăng nhập</Label>
                  <Input 
                    id="username" 
                    {...register("username")}
                    placeholder="Nhập tên đăng nhập" 
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">{errors.username.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    {...register("password")}
                    placeholder="Nhập mật khẩu" 
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Chưa có tài khoản?{" "}
                  <Link href="/register" className="text-primary hover:underline">
                    Đăng ký ngay
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}