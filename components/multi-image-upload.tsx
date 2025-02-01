"use client"

import { useState } from "react"
import { ImageUpload } from "./image-upload"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface MultiImageUploadProps {
  onImagesChange: (urls: string[]) => void
  defaultImages?: string[]
  maxImages?: number
}

export function MultiImageUpload({ onImagesChange, defaultImages = [], maxImages = 10 }: MultiImageUploadProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(defaultImages)

  const handleImageUploaded = (url: string, index: number) => {
    const newUrls = [...imageUrls]
    newUrls[index] = url
    setImageUrls(newUrls)
    onImagesChange(newUrls.filter(Boolean))
  }

  const handleAddImage = () => {
    if (imageUrls.length < maxImages) {
      setImageUrls([...imageUrls, ""])
    }
  }

  const handleRemoveImage = (index: number) => {
    const newUrls = [...imageUrls]
    newUrls.splice(index, 1)
    setImageUrls(newUrls)
    onImagesChange(newUrls.filter(Boolean))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {imageUrls.map((url, index) => (
          <div key={index} className="space-y-2">
            <ImageUpload
              defaultImage={url}
              onImageUploaded={(newUrl) => handleImageUploaded(newUrl, index)}
              onRemove={() => handleRemoveImage(index)}
            />
          </div>
        ))}

        {imageUrls.length < maxImages && (
          <Button
            type="button"
            variant="outline"
            onClick={handleAddImage}
            className="flex aspect-square w-full max-w-[200px] flex-col items-center justify-center rounded-md border border-dashed"
          >
            <Plus className="h-6 w-6" />
            <span className="mt-2">Thêm hình ảnh</span>
          </Button>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        Tối đa {maxImages} hình ảnh. Đã tải lên {imageUrls.filter(Boolean).length}/{maxImages}.
      </p>
    </div>
  )
}
