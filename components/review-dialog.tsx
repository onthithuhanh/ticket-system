"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Star, Loader2 } from "lucide-react"

interface Review {
  id: number
  title: string
  rating: number
  comment: string
  createdAt: string
  user: {
    id: string
    userName: string
    fullName: string
  }
}

interface ReviewDialogProps {
  isOpen: boolean
  onClose: () => void
  bookingId: string
}

export function ReviewDialog({ isOpen, onClose, bookingId }: ReviewDialogProps) {
  const [review, setReview] = useState<Review | null>(null)
  const [title, setTitle] = useState("")
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const resetForm = () => {
    setTitle("")
    setRating(5)
    setComment("")
    setReview(null)
    setIsLoading(false)
  }

  useEffect(() => {
    if (isOpen && bookingId) {
      fetchReview()
    }
  }, [isOpen, bookingId])

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const fetchReview = async () => {
    try {
      setIsLoading(true)
      const response = await api.get(`/Reviews?BookingId=${bookingId}`)
      if (response.data) {
        setReview(response.data.contends[0])
      }
    } catch (error) {
      console.error("Error fetching review:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      await api.post("/Reviews", {
        title,
        comment,
        rating,
        bookingId,
      })
      toast({
        title: "Thành công",
        description: "Đánh giá của bạn đã được gửi",
      })
      handleClose()
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể gửi đánh giá",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{review ? "Đánh giá của bạn" : "Viết đánh giá"}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : review ? (
          <div className="space-y-4">
            <h3 className="font-medium">{review.title}</h3>
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{review.comment}</p>
            <p className="text-xs text-muted-foreground">
              Đánh giá vào {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              placeholder="Tiêu đề đánh giá"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 cursor-pointer ${
                    i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setRating(i + 1)}
                />
              ))}
            </div>
            <Textarea
              placeholder="Viết đánh giá của bạn..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !comment.trim() || !title.trim()}
              className="w-full"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 