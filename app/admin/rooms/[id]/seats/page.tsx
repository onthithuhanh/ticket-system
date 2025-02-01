"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, RotateCcw, Grid3X3 } from "lucide-react"

interface Seat {
  id: string
  row: number
  number: number
  type: "vip" | "standard" | "economy"
  status: "available" | "blocked" | "maintenance"
}

export default function RoomSeatsPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSeatType, setSelectedSeatType] = useState<"vip" | "standard" | "economy">("standard")
  const [selectedStatus, setSelectedStatus] = useState<"available" | "blocked" | "maintenance">("available")
  const [isEditMode, setIsEditMode] = useState(false)

  // Dữ liệu mẫu cho phòng
  const room = {
    id: Number.parseInt(params.id),
    name: "Sân khấu chính",
    totalSeats: {
      vip: 50,
      standard: 200,
      economy: 250,
    },
  }

  // Tạo sơ đồ ghế mẫu
  const [seats, setSeats] = useState<Seat[]>(() => {
    const seatArray: Seat[] = []
    let seatId = 1

    // Tạo ghế VIP (2 hàng đầu)
    for (let row = 1; row <= 2; row++) {
      for (let number = 1; number <= 25; number++) {
        seatArray.push({
          id: `VIP-${seatId}`,
          row,
          number,
          type: "vip",
          status: "available",
        })
        seatId++
      }
    }

    // Tạo ghế thường (8 hàng giữa)
    for (let row = 3; row <= 10; row++) {
      for (let number = 1; number <= 25; number++) {
        seatArray.push({
          id: `STD-${seatId}`,
          row,
          number,
          type: "standard",
          status: "available",
        })
        seatId++
      }
    }

    // Tạo ghế tiết kiệm (10 hàng cuối)
    for (let row = 11; row <= 20; row++) {
      for (let number = 1; number <= 25; number++) {
        seatArray.push({
          id: `ECO-${seatId}`,
          row,
          number,
          type: "economy",
          status: "available",
        })
        seatId++
      }
    }

    return seatArray
  })

  const [seatConfig, setSeatConfig] = useState({
    rows: 20,
    seatsPerRow: 25,
    vipRows: 2,
    standardRows: 8,
    economyRows: 10,
  })

  const handleSeatClick = (seatId: string) => {
    if (!isEditMode) return

    setSeats((prev) =>
      prev.map((seat) => (seat.id === seatId ? { ...seat, type: selectedSeatType, status: selectedStatus } : seat)),
    )
  }

  const handleSaveLayout = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Đã lưu sơ đồ ghế",
        description: "Sơ đồ ghế đã được cập nhật thành công",
      })
      setIsEditMode(false)
    } catch (error) {
      toast({
        title: "Lỗi lưu sơ đồ",
        description: "Đã xảy ra lỗi khi lưu sơ đồ ghế",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetLayout = () => {
    // Reset về layout mặc định
    const newSeats: Seat[] = []
    let seatId = 1

    for (let row = 1; row <= seatConfig.rows; row++) {
      for (let number = 1; number <= seatConfig.seatsPerRow; number++) {
        let type: "vip" | "standard" | "economy" = "economy"

        if (row <= seatConfig.vipRows) {
          type = "vip"
        } else if (row <= seatConfig.vipRows + seatConfig.standardRows) {
          type = "standard"
        }

        newSeats.push({
          id: `${type.toUpperCase()}-${seatId}`,
          row,
          number,
          type,
          status: "available",
        })
        seatId++
      }
    }

    setSeats(newSeats)
    toast({
      title: "Đã reset sơ đồ ghế",
      description: "Sơ đồ ghế đã được khôi phục về mặc định",
    })
  }

  const getSeatColor = (seat: Seat) => {
    if (seat.status === "blocked") return "bg-red-500"
    if (seat.status === "maintenance") return "bg-yellow-500"

    switch (seat.type) {
      case "vip":
        return "bg-purple-500 hover:bg-purple-600"
      case "standard":
        return "bg-blue-500 hover:bg-blue-600"
      case "economy":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-gray-500"
    }
  }

  const getSeatStats = () => {
    const stats = {
      vip: { total: 0, available: 0, blocked: 0, maintenance: 0 },
      standard: { total: 0, available: 0, blocked: 0, maintenance: 0 },
      economy: { total: 0, available: 0, blocked: 0, maintenance: 0 },
    }

    seats.forEach((seat) => {
      stats[seat.type].total++
      stats[seat.type][seat.status]++
    })

    return stats
  }

  const seatStats = getSeatStats()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/admin/rooms/${room.id}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý ghế - {room.name}</h1>
            <p className="text-muted-foreground">Thiết lập và quản lý sơ đồ ghế cho phòng</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleResetLayout}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button variant={isEditMode ? "destructive" : "outline"} onClick={() => setIsEditMode(!isEditMode)}>
            <Grid3X3 className="mr-2 h-4 w-4" />
            {isEditMode ? "Thoát chỉnh sửa" : "Chỉnh sửa"}
          </Button>
          <Button onClick={handleSaveLayout} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Đang lưu..." : "Lưu sơ đồ"}
          </Button>
        </div>
      </div>

      {/* Thống kê ghế */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ghế VIP</CardTitle>
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seatStats.vip.total}</div>
            <p className="text-xs text-muted-foreground">
              Có sẵn: {seatStats.vip.available} | Bị chặn: {seatStats.vip.blocked}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ghế thường</CardTitle>
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seatStats.standard.total}</div>
            <p className="text-xs text-muted-foreground">
              Có sẵn: {seatStats.standard.available} | Bị chặn: {seatStats.standard.blocked}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ghế tiết kiệm</CardTitle>
            <div className="w-4 h-4 bg-green-500 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seatStats.economy.total}</div>
            <p className="text-xs text-muted-foreground">
              Có sẵn: {seatStats.economy.available} | Bị chặn: {seatStats.economy.blocked}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Sơ đồ ghế</CardTitle>
              <CardDescription>
                {isEditMode ? "Nhấp vào ghế để thay đổi loại và trạng thái" : "Xem sơ đồ ghế hiện tại"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Màn hình/Sân khấu */}
              <div className="mb-8">
                <div className="w-full h-12 bg-gray-800 rounded-lg flex items-center justify-center text-white font-medium">
                  SÂN KHẤU
                </div>
              </div>

              {/* Sơ đồ ghế */}
              <div className="space-y-2">
                {Array.from({ length: seatConfig.rows }, (_, rowIndex) => (
                  <div key={rowIndex} className="flex items-center gap-2">
                    <div className="w-8 text-center text-sm font-medium text-muted-foreground">{rowIndex + 1}</div>
                    <div className="flex gap-1">
                      {seats
                        .filter((seat) => seat.row === rowIndex + 1)
                        .map((seat) => (
                          <button
                            key={seat.id}
                            className={`w-6 h-6 rounded text-xs text-white font-medium transition-colors ${getSeatColor(seat)} ${
                              isEditMode ? "cursor-pointer" : "cursor-default"
                            }`}
                            onClick={() => handleSeatClick(seat.id)}
                            title={`${seat.id} - ${seat.type} - ${seat.status}`}
                          >
                            {seat.number}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chú thích */}
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span>VIP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>Thường</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Tiết kiệm</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Bị chặn</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span>Bảo trì</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {isEditMode && (
            <Card>
              <CardHeader>
                <CardTitle>Công cụ chỉnh sửa</CardTitle>
                <CardDescription>Chọn loại ghế và trạng thái để áp dụng</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seatType">Loại ghế</Label>
                  <Select value={selectedSeatType} onValueChange={(value: any) => setSelectedSeatType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="standard">Thường</SelectItem>
                      <SelectItem value="economy">Tiết kiệm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seatStatus">Trạng thái</Label>
                  <Select value={selectedStatus} onValueChange={(value: any) => setSelectedStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Có sẵn</SelectItem>
                      <SelectItem value="blocked">Bị chặn</SelectItem>
                      <SelectItem value="maintenance">Bảo trì</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Cấu hình sơ đồ</CardTitle>
              <CardDescription>Thiết lập cơ bản cho sơ đồ ghế</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rows">Số hàng</Label>
                <Input
                  id="rows"
                  type="number"
                  value={seatConfig.rows}
                  onChange={(e) => setSeatConfig((prev) => ({ ...prev, rows: Number.parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seatsPerRow">Ghế mỗi hàng</Label>
                <Input
                  id="seatsPerRow"
                  type="number"
                  value={seatConfig.seatsPerRow}
                  onChange={(e) =>
                    setSeatConfig((prev) => ({ ...prev, seatsPerRow: Number.parseInt(e.target.value) || 0 }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vipRows">Hàng VIP</Label>
                <Input
                  id="vipRows"
                  type="number"
                  value={seatConfig.vipRows}
                  onChange={(e) =>
                    setSeatConfig((prev) => ({ ...prev, vipRows: Number.parseInt(e.target.value) || 0 }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="standardRows">Hàng thường</Label>
                <Input
                  id="standardRows"
                  type="number"
                  value={seatConfig.standardRows}
                  onChange={(e) =>
                    setSeatConfig((prev) => ({ ...prev, standardRows: Number.parseInt(e.target.value) || 0 }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="economyRows">Hàng tiết kiệm</Label>
                <Input
                  id="economyRows"
                  type="number"
                  value={seatConfig.economyRows}
                  onChange={(e) =>
                    setSeatConfig((prev) => ({ ...prev, economyRows: Number.parseInt(e.target.value) || 0 }))
                  }
                />
              </div>
              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  <p>Tổng ghế: {seatConfig.rows * seatConfig.seatsPerRow}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
