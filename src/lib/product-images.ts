const CATEGORY_IMAGE_MAP: Record<string, string> = {
  stud: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80",
  dangle: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
  hoop: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80",
  clip: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80",
}

export const heroImageSrc = "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1200&q=80"

export function getCategoryImage(category?: string | null) {
  if (!category) {
    return "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80"
  }

  return CATEGORY_IMAGE_MAP[category] ?? "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80"
}

export function getProductImageSrc(imageUrl?: string | null, category?: string | null) {
  if (!imageUrl) {
    return getCategoryImage(category)
  }

  // 如果是完整 URL，直接返回
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl
  }

  // 如果是本地路径，返回分类图片
  if (imageUrl.startsWith("/")) {
    return getCategoryImage(category)
  }

  return imageUrl
}
