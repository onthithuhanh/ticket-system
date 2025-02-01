"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage" 
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from '@/hooks/use-toast';
import { Trash, Upload, ImageIcon } from "lucide-react"
import Image from "next/image"
import { storage } from "@/lib/firebase/config"

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  defaultImage?: string
  onRemove?: () => void
}

export function ImageUpload({ onImageUploaded, defaultImage, onRemove }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [imageUrl, setImageUrl] = useState(defaultImage || "")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast(); 

  const handleUpload = async (file: File) => {
    if (!file) return

    setUploading(true)
    setProgress(0)

    // Tạo tên file duy nhất để tránh trùng lặp
    const fileName = `${new Date().getTime()}_${file.name}`
    const storageRef = ref(storage, `products/${fileName}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Cập nhật tiến trình
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setProgress(progress)
      },
      (error) => {
        // Xử lý lỗi
        console.error("Upload error:", error)
        toast({
          title: "Lỗi tải lên",
          description: "Đã xảy ra lỗi khi tải lên hình ảnh.",
          variant: "destructive",
        })
        setUploading(false)
      },
      async () => {
        // Hoàn thành
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        setImageUrl(downloadURL)
        onImageUploaded(downloadURL)
        setUploading(false)
        toast({
          title: "Tải lên thành công",
          description: "Hình ảnh đã được tải lên thành công.",
        })
      },
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = () => {
    setImageUrl("")
    if (onRemove) {
      onRemove()
    }
  }

  return (
    <div className="space-y-4">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {imageUrl ? (
        <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-md border">
          <Image src={imageUrl || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 rounded-full"
            onClick={handleRemove}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={handleButtonClick}
          className="flex aspect-square w-full max-w-[200px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
        >
          <ImageIcon className="mb-2 h-10 w-10 text-gray-400" />
          <p className="text-sm text-gray-500">Nhấn để tải lên hình ảnh</p>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2 w-full" />
          <p className="text-xs text-muted-foreground">Đang tải lên: {Math.round(progress)}%</p>
        </div>
      )}

      {!imageUrl && !uploading && (
        <Button type="button" onClick={handleButtonClick} disabled={uploading}>
          <Upload className="mr-2 h-4 w-4" />
          Tải lên hình ảnh
        </Button>
      )}
    </div>
  )
}
