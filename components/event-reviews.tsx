"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import { api } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  userName: string
  fullName: string
  avatarUrl: string
  email: string
  phoneNumber: string
}

interface Event {
  id: number
  name: string
  thumbnail: string
}

interface Schedule {
  startTime: string
  event: Event
}

interface Booking {
  totalPrice: number
  status: string
  method: string
  user: User
  schedule: Schedule
}

interface Review {
  title: string
  comment: string
  rating: number
  bookingId: string
  booking: Booking
}

interface PaginatedResponse {
  page: number
  size: number
  totalPages: number
  totalItems: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  contends: Review[]
}

interface EventReviewsProps {
  eventId: number
}

export function EventReviews({ eventId }: EventReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [averageRating, setAverageRating] = useState(0)
  const [pagination, setPagination] = useState({
    page: 1,
    size: 200,
    totalPages: 1,
    totalItems: 0,
    hasPreviousPage: false,
    hasNextPage: false
  })

  useEffect(() => {
    fetchReviews()
  }, [eventId])

  const fetchReviews = async () => {
    try {
      setIsLoading(true)
      const response = await api.get<PaginatedResponse>(`/Reviews?EventId=${eventId}`)
      if (response.data) {
        setReviews(response.data.contends || [])
        const totalRating = response.data.contends.reduce((sum, review) => sum + review.rating, 0)
        const avg = response.data.contends.length > 0 ? totalRating / response.data.contends.length : 0
        setAverageRating(avg)
        setPagination({
          page: response.data.page,
          size: response.data.size,
          totalPages: response.data.totalPages,
          totalItems: response.data.totalItems,
          hasPreviousPage: response.data.hasPreviousPage,
          hasNextPage: response.data.hasNextPage
        })
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-500">Thành công</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Chờ xử lý</Badge>
      case "failed":
        return <Badge className="bg-red-500">Thất bại</Badge>
      default:
        return <Badge>Không xác định</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Đánh giá</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Chưa có đánh giá nào</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đánh giá ({pagination.totalItems})</CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {averageRating.toFixed(1)} / 5.0
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {reviews.map((review) => (
          <div key={review.bookingId} className="border-b pb-6 last:border-0 last:pb-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-2">
                <img
                  src={review.booking.user.avatarUrl || "https://i.pinimg.com/222x/2a/65/f9/2a65f948b71ff3a70e21c64bca10a312.jpg"}
                  alt={review.booking.user.fullName || review.booking.user.userName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium">{review.booking.user.fullName || review.booking.user.userName}</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <h3 className="font-medium mb-1">{review.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
            <div className="flex items-center justify-end text-xs text-muted-foreground mb-2">
              <span>{new Date(review.booking.schedule.startTime).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
} 