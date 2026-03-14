"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  className?: string
  interactive?: boolean
  onRate?: (rating: number) => void
}

const sizeMap = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  className,
  interactive = false,
  onRate,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxRating }).map((_, i) => {
        const filled = i < Math.floor(rating)
        const partial = i === Math.floor(rating) && rating % 1 !== 0
        const percentage = partial ? (rating % 1) * 100 : 0

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(i + 1)}
            className={cn(
              "relative",
              interactive && "cursor-pointer hover:scale-110 transition-transform"
            )}
          >
            {/* Background star (empty) */}
            <Star
              className={cn(
                sizeMap[size],
                "text-stone-200 fill-stone-200"
              )}
            />
            {/* Foreground star (filled) */}
            {(filled || partial) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? "100%" : `${percentage}%` }}
              >
                <Star
                  className={cn(
                    sizeMap[size],
                    "text-yellow-400 fill-yellow-400"
                  )}
                />
              </div>
            )}
          </button>
        )
      })}
      <span className="ml-1 text-sm text-stone-500">({rating.toFixed(1)})</span>
    </div>
  )
}
