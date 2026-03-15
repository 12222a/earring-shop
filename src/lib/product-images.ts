const CATEGORY_IMAGE_MAP: Record<string, string> = {
  stud: "/catalog/stud.svg",
  dangle: "/catalog/dangle.svg",
  hoop: "/catalog/hoop.svg",
  clip: "/catalog/clip.svg",
}

export const heroImageSrc = "/catalog/hero-display.svg"

export function getCategoryImage(category?: string | null) {
  if (!category) {
    return "/catalog/default.svg"
  }

  return CATEGORY_IMAGE_MAP[category] ?? "/catalog/default.svg"
}

export function getProductImageSrc(imageUrl?: string | null, category?: string | null) {
  if (!imageUrl) {
    return getCategoryImage(category)
  }

  if (imageUrl.startsWith("/")) {
    return imageUrl
  }

  if (imageUrl.includes("images.unsplash.com")) {
    return getCategoryImage(category)
  }

  return imageUrl
}
