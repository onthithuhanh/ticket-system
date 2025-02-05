"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link" 
import { amenitiesApi } from "@/lib/api/amenities"
import { useToast } from "@/hooks/use-toast"

export default function CreateAmenityPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await amenitiesApi.createAmenity({ name })
            toast({
                title: "Thành công",
                description: "Tạo tiện nghi mới thành công",
            })
            console.log(res);

            router.push("/admin/amenities")
        } catch (error: any) {
            toast({
                title: "Lỗi",
                description: error.response?.data?.message || "Đã xảy ra lỗi khi tạo tiện nghi",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

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
                    <h1 className="text-3xl font-bold tracking-tight">Thêm tiện nghi mới</h1>
                    <p className="text-muted-foreground">Tạo tiện nghi mới cho hệ thống nhà hát</p>
                </div>
            </div>

            {/* Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Thông tin tiện nghi</CardTitle>
                    <CardDescription>Nhập tên tiện nghi mới</CardDescription>
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
                                {isLoading ? "Đang tạo..." : "Tạo tiện nghi"}
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
