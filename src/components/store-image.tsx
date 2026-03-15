"use client"

import { useEffect, useState } from "react"
import Image, { type ImageProps } from "next/image"

type StoreImageProps = Omit<ImageProps, "src"> & {
  src: string
  fallbackSrc?: string
}

export function StoreImage({ src, fallbackSrc, alt, ...props }: StoreImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [usedFallback, setUsedFallback] = useState(false)

  useEffect(() => {
    setCurrentSrc(src)
    setUsedFallback(false)
  }, [src, fallbackSrc])

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (!fallbackSrc || usedFallback || fallbackSrc === currentSrc) {
          return
        }

        setCurrentSrc(fallbackSrc)
        setUsedFallback(true)
      }}
    />
  )
}
