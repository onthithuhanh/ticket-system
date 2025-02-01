"use client"

import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function LoginPage() {
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
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Nhập email của bạn" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input id="password" type="password" placeholder="Nhập mật khẩu" />
                </div>
                <Button className="w-full">Đăng nhập</Button>
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