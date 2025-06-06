"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Upload, X, Image as ImageIcon } from "lucide-react"
import { eventsApi } from "@/lib/api/events"
import { uploadImage, uploadMultipleImages } from "@/lib/firebase/storage"

interface ImagePreview {
  file: File
  preview: string
}

export default function EditEventPage({ params }: { params: Promise<{ id: string }>  }) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    isCancelled: false,
    shortDescription: "",
    detailedDescription: "",
    director: "",
    actors: "",
    thumbnail: "",
    category: "Drame",
    eventImages: [] as { id: number; imageUrl: string }[],
    id: 0,
    createdBy: "",
    createdAt: "",
    modifiedBy: "",
    modifiedAt: "",
    deletedBy: null as string | null,
    deletedAt: null as string | null
  })
  const [mainImage, setMainImage] = useState<ImagePreview | null>(null)
  const [additionalImages, setAdditionalImages] = useState<ImagePreview[]>([])
  const [existingImages, setExistingImages] = useState<{ id: number; imageUrl: string }[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const mainImageInputRef = useRef<HTMLInputElement>(null)
  const additionalImagesInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventsApi.getEvent(parseInt(id))
        setFormData({
          name: response.name,
          duration: response.duration.toString(),
          isCancelled: response.isCancelled,
          shortDescription: response.shortDescription,
          detailedDescription: response.detailedDescription || "",
          director: response.director,
          actors: response.actors || "",
          thumbnail: response.thumbnail,
          category: response.category,
          eventImages: response.eventImages || [],
          id: response.id,
          createdBy: response.createdBy,
          createdAt: response.createdAt,
          modifiedBy: response.modifiedBy,
          modifiedAt: response.modifiedAt,
          deletedBy: response.deletedBy,
          deletedAt: response.deletedAt
        })
        setExistingImages(response.eventImages || [])
      } catch (error: any) {
        toast({
          title: "Lỗi",
          description: error.response?.data?.message || "Không thể tải thông tin vở kịch",
          variant: "destructive",
        })
        router.push("/admin/events")
      }
    }

    fetchEvent()
  }, [id, router, toast])

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setMainImage({
          file,
          preview: reader.result as string
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = files.map(file => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      return new Promise<ImagePreview>((resolve) => {
        reader.onloadend = () => {
          resolve({
            file,
            preview: reader.result as string
          })
        }
      })
    })

    Promise.all(newImages).then(images => {
      setAdditionalImages(prev => [...prev, ...images])
    })
  }

  const removeMainImage = () => {
    setMainImage(null)
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = ""
    }
  }

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index))
    if (additionalImagesInputRef.current) {
      additionalImagesInputRef.current.value = ""
    }
  }

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    // Kiểm tra các trường bắt buộc
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên vở kịch"
    if (!formData.category) newErrors.category = "Vui lòng chọn thể loại"
    if (!formData.duration) newErrors.duration = "Vui lòng nhập thời lượng"
    if (!formData.shortDescription.trim()) newErrors.shortDescription = "Vui lòng nhập mô tả ngắn"
    if (!formData.director.trim()) newErrors.director = "Vui lòng nhập tên đạo diễn"
    
    // Kiểm tra thời lượng
    const duration = parseInt(formData.duration)
    if (isNaN(duration) || duration <= 30) {
      newErrors.duration = "Thời lượng phải lớn hơn 30 phút"
    }
    
    // Kiểm tra hình ảnh
    if (!formData.thumbnail && !mainImage) {
      newErrors.mainImage = "Vui lòng tải lên ảnh chính"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng kiểm tra lại thông tin",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Upload main image
      let thumbnailUrl = formData.thumbnail
      if (mainImage) {
        thumbnailUrl = await uploadImage(mainImage.file, "events")
      }

      // Upload additional images
      const newEventImages = await uploadMultipleImages(
        additionalImages.map(img => img.file),
        "events"
      ).then(urls => urls.map(url => ({ 
        imageUrl: url 
      })))

      const data = {
        ...formData,
        duration: parseInt(formData.duration),
        thumbnail: thumbnailUrl,
        eventImages: [...existingImages, ...newEventImages],
      }

      await eventsApi.updateEvent(parseInt(id), data)
      toast({
        title: "Thành công",
        description: "Đã cập nhật vở kịch thành công",
      })
      router.push("/admin/events")
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật vở kịch",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Link href="/admin/events">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa vở kịch</h1>
          <p className="text-muted-foreground">Cập nhật thông tin vở kịch</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>Nhập thông tin cơ bản về vở kịch</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên vở kịch *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Nhập tên vở kịch"
                    required
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Thể loại *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn thể loại" />
                      </SelectTrigger>
                      <SelectContent> 
                        <SelectItem value="Drame">Kịch</SelectItem>  
                        <SelectItem value="Comedy">Hài kịch</SelectItem>
                        <SelectItem value="Opera">Opera</SelectItem>
                        <SelectItem value="Dance">Múa ballet</SelectItem>
                        <SelectItem value="Circus">Xiếc</SelectItem>
                        <SelectItem value="Music">Nhạc kịch</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Thời lượng (phút) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                      placeholder="120"
                      required
                    />
                    {errors.duration && <p className="text-sm text-red-500">{errors.duration}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Mô tả ngắn *</Label>
                  <Textarea
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                    placeholder="Mô tả ngắn về vở kịch"
                    rows={3}
                    required
                  />
                  {errors.shortDescription && <p className="text-sm text-red-500">{errors.shortDescription}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="detailedDescription">Mô tả chi tiết</Label>
                  <Textarea
                    id="detailedDescription"
                    value={formData.detailedDescription}
                    onChange={(e) => handleInputChange("detailedDescription", e.target.value)}
                    placeholder="Mô tả chi tiết về vở kịch"
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin sản xuất</CardTitle>
                <CardDescription>Thông tin về đạo diễn và diễn viên</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="director">Đạo diễn *</Label>
                  <Input
                    id="director"
                    value={formData.director}
                    onChange={(e) => handleInputChange("director", e.target.value)}
                    placeholder="Tên đạo diễn"
                    required
                  />
                  {errors.director && <p className="text-sm text-red-500">{errors.director}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actors">Diễn viên</Label>
                  <Textarea
                    id="actors"
                    value={formData.actors}
                    onChange={(e) => handleInputChange("actors", e.target.value)}
                    placeholder="Danh sách diễn viên (mỗi tên một dòng)"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hình ảnh</CardTitle>
                <CardDescription>Tải lên poster và hình ảnh</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Image Upload */}
                <div className="space-y-4">
                  <Label>Ảnh chính (Poster) *</Label>
                  {mainImage ? (
                    <div className="relative">
                      <img
                        src={mainImage.preview}
                        alt="Main preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={removeMainImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : formData.thumbnail ? (
                    <div className="relative">
                      <img
                        src={formData.thumbnail}
                        alt="Current thumbnail"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => handleInputChange("thumbnail", "")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => mainImageInputRef.current?.click()}
                        >
                          Chọn ảnh chính
                        </Button>
                        <input
                          type="file"
                          ref={mainImageInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleMainImageChange}
                        />
                        <p className="mt-2 text-sm text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
                        {errors.mainImage && <p className="mt-2 text-sm text-red-500">{errors.mainImage}</p>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Images Upload */}
                <div className="space-y-4">
                  <Label>Ảnh phụ</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {existingImages.map((image, index) => (
                      <div key={`existing-${index}`} className="relative">
                        <img
                          src={image.imageUrl}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeExistingImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {additionalImages.map((image, index) => (
                      <div key={`new-${index}`} className="relative">
                        <img
                          src={image.preview}
                          alt={`Additional ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeAdditionalImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => additionalImagesInputRef.current?.click()}
                        >
                          Thêm ảnh
                        </Button>
                        <input
                          type="file"
                          ref={additionalImagesInputRef}
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleAdditionalImagesChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trạng thái</CardTitle>
                <CardDescription>Thiết lập trạng thái vở kịch</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="isCancelled">Trạng thái</Label>
                  <Select
                    value={formData.isCancelled ? "cancelled" : "active"}
                    onValueChange={(value) => handleInputChange("isCancelled", value === "cancelled")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hiệu lực</SelectItem>
                      <SelectItem value="cancelled">Đã ẩn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/events">
            <Button type="button" variant="outline">
              Hủy
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang cập nhật..." : "Cập nhật vở kịch"}
          </Button>
        </div>
      </form>
    </div>
  )
}
