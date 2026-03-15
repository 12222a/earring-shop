export type ProductImageVariant =
  | "hero"
  | "category"
  | "card"
  | "detail"
  | "thumb"
  | "mini"

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  stud: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0",
  dangle: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908",
  hoop: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1",
  clip: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9",
}

const IMAGE_PRESETS: Record<ProductImageVariant, { width: number; quality: number }> = {
  hero: { width: 1600, quality: 88 },
  category: { width: 1200, quality: 86 },
  card: { width: 900, quality: 84 },
  detail: { width: 1600, quality: 90 },
  thumb: { width: 320, quality: 80 },
  mini: { width: 220, quality: 76 },
}

const DEFAULT_CATEGORY = "stud"
const HERO_BASE_URL = "https://images.unsplash.com/photo-1617038220319-276d3cfab638"

function isUnsplashUrl(src: string) {
  try {
    const url = new URL(src)
    return url.hostname === "images.unsplash.com" || url.hostname.endsWith(".unsplash.com")
  } catch {
    return false
  }
}

function applyUnsplashPreset(src: string, variant: ProductImageVariant) {
  if (!isUnsplashUrl(src)) {
    return src
  }

  const url = new URL(src)
  const preset = IMAGE_PRESETS[variant]
  url.searchParams.set("w", String(preset.width))
  url.searchParams.set("q", String(preset.quality))
  url.searchParams.set("auto", "format")

  if (variant === "hero") {
    url.searchParams.set("fit", "max")
    url.searchParams.delete("crop")
    return url.toString()
  }

  url.searchParams.set("fit", "crop")
  url.searchParams.set("crop", "faces,center")
  return url.toString()
}

export const heroImageSrc = applyUnsplashPreset(HERO_BASE_URL, "hero")

export function getCategoryImage(
  category?: string | null,
  variant: ProductImageVariant = "category"
) {
  const baseImage = CATEGORY_IMAGE_MAP[category ?? ""] ?? CATEGORY_IMAGE_MAP[DEFAULT_CATEGORY]
  return applyUnsplashPreset(baseImage, variant)
}

export function getProductImageSrc(
  imageUrl?: string | null,
  category?: string | null,
  variant: ProductImageVariant = "card"
) {
  const normalized = imageUrl?.trim()

  if (!normalized) {
    return getCategoryImage(category, variant)
  }

  if (normalized.startsWith("/")) {
    return normalized
  }

  return applyUnsplashPreset(normalized, variant)
}

export function toAbsoluteImageUrl(src: string, origin?: string | null) {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src
  }

  if (!origin) {
    return src
  }

  return `${origin.replace(/\/$/, "")}/${src.replace(/^\//, "")}`
}
