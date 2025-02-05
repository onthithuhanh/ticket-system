"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Monitor, Projector, Wifi, AirVent, Speaker, Camera } from "lucide-react"
import Link from "next/link"
import { amenitiesApi } from "@/lib/api/amenities"
import { useToast } from "@/hooks/use-toast"

const iconOptions = [
  { value: "Monitor", label: "Màn hình/TV", icon: Monitor },
  { value: "Projector", label: "Máy chiếu", icon: Projector },
  { value: "Wifi", label: "WiFi/Internet", icon: Wifi },
  { value: "AirVent", label: "Điều hòa", icon: AirVent },
  { value: "Speaker", label: "Âm thanh", icon: Speaker },
  { value: "Camera", label: "Camera/Ghi hình", icon: Camera },
]

export default function EditAmenityPage({ params }: { params: Promise<{ id: string }> }) {

  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("Monitor")
  const [status, setStatus] = useState("active")
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  useEffect(() => {
    if (id) {
      fetchAmenity(id)
    }
  }, [id])

  const fetchAmenity = async (id: string) => {
    try {
      const response = await amenitiesApi.getAmenity(id)
      setName(response.name)
      setDescription(response.description || "")
      setIcon(response.icon || "Monitor")
      setStatus(response.status || "active")
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Đã xảy ra lỗi khi tải thông tin tiện nghi",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    setIsLoading(true)
    try {
      await amenitiesApi.updateAmenity(id, { name, description, icon, status })
      toast({
        title: "Thành công",
        description: "Cập nhật tiện nghi thành công",
      })
      router.push("/admin/amenities")
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật tiện nghi",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const selectedIcon = iconOptions.find((option) => option.value === icon)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/amenities">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa tiện nghi</h1>
          <p className="text-muted-foreground">Cập nhật thông tin tiện nghi</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin tiện nghi</CardTitle>
          <CardDescription>Chỉnh sửa thông tin tiện nghi</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Tên tiện nghi *</Label>
              <Input
                id="name"
                placeholder="Nhập tên tiện nghi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>


            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/amenities">Hủy</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
