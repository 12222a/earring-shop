"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { StoreImage } from "@/components/store-image"
import { cn } from "@/lib/utils"
import { getCategoryImage, getProductImageSrc } from "@/lib/product-images"

interface ImageGalleryProps {
  images: string[]
  productName: string
  category?: string
}

export function ImageGallery({ images, productName, category }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const resolvedImages =
    images && images.length > 0
      ? images.map((image) => getProductImageSrc(image, category, "detail"))
      : [getProductImageSrc(undefined, category, "detail")]

  const fallbackSrc = getCategoryImage(category, "detail")

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % resolvedImages.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + resolvedImages.length) % resolvedImages.length)
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-stone-200 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(246,241,234,0.95)_55%,_rgba(232,223,212,0.92))]">
        <StoreImage
          src={resolvedImages[currentIndex]}
          fallbackSrc={fallbackSrc}
          alt={`${productName} 图片 ${currentIndex + 1}`}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-contain p-6"
        />

        {resolvedImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-colors hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-colors hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {resolvedImages.length > 1 && (
          <div className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-1 text-sm text-white">
            {currentIndex + 1} / {resolvedImages.length}
          </div>
        )}
      </div>

      {resolvedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {resolvedImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(246,241,234,0.95)_55%,_rgba(232,223,212,0.92))] transition-colors",
                index === currentIndex
                  ? "border-[#D4A574]"
                  : "border-transparent hover:border-stone-300"
              )}
            >
              <StoreImage
                src={getProductImageSrc(image, category, "thumb")}
                fallbackSrc={getCategoryImage(category, "thumb")}
                alt={`${productName} 缩略图 ${index + 1}`}
                fill
                sizes="64px"
                className="object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
