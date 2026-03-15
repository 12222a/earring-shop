import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StoreImage } from "@/components/store-image"
import { isDatabaseConfigured } from "@/lib/database"
import { mockProducts } from "@/lib/mock-products"
import { getCategoryImage, getProductImageSrc } from "@/lib/product-images"

export const dynamic = "force-dynamic"

async function getProducts(searchParams: { [key: string]: string | string[] | undefined }) {
  const category = searchParams.category as string
  const search = searchParams.search as string

  const filterProducts = (products: typeof mockProducts) => {
    let filtered = products

    if (category && category !== "all") {
      filtered = filtered.filter((product) => product.category === category)
    }

    if (search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    return filtered
  }

  if (!isDatabaseConfigured) {
    return filterProducts(mockProducts)
  }

  try {
    const { prisma } = await import("@/lib/prisma")
    const where: Record<string, unknown> = {}

    if (category && category !== "all") {
      where.category = category
    }

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      }
    }

    return await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("Failed to load products:", error)
    return filterProducts(mockProducts)
  }
}

type Product = Awaited<ReturnType<typeof getProducts>>[number]

const categories = [
  { id: "all", name: "全部" },
  { id: "stud", name: "耳钉" },
  { id: "dangle", name: "耳环" },
  { id: "hoop", name: "耳圈" },
  { id: "clip", name: "耳夹" },
]

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const products = await getProducts(searchParams)
  const category = (searchParams.category as string) || "all"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">全部商品</h1>
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <Link key={item.id} href={`/products?category=${item.id}`}>
              <Button
                variant={category === item.id ? "default" : "outline"}
                size="sm"
                style={category === item.id ? { backgroundColor: "#D4A574" } : {}}
              >
                {item.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-stone-500">暂时没有找到对应商品。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product: Product) => {
            const resolvedCategory = "category" in product ? product.category : undefined
            const imageSrc = getProductImageSrc(
              "imageUrl" in product ? product.imageUrl : undefined,
              resolvedCategory,
              "card"
            )
            const fallbackSrc = getCategoryImage(resolvedCategory, "card")

            return (
              <Link key={product.id} href={`/products/${product.id}`} className="group">
                <div className="overflow-hidden rounded-xl bg-white shadow transition-shadow hover:shadow-lg">
                  <div className="relative h-64 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.96),_rgba(245,240,233,0.94)_55%,_rgba(232,223,212,0.92))]">
                    <StoreImage
                      src={imageSrc}
                      fallbackSrc={fallbackSrc}
                      alt={product.name}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    {"stock" in product && product.stock <= 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <span className="font-medium text-white">已售罄</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="mb-1 font-medium text-stone-900">{product.name}</h3>
                    {"description" in product && (
                      <p className="mb-2 line-clamp-2 text-sm text-stone-500">{product.description}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <p className="font-bold text-[#D4A574]">¥{Number(product.price).toFixed(2)}</p>
                      {"stock" in product && product.stock > 0 && product.stock < 10 && (
                        <span className="text-xs text-red-500">仅剩 {product.stock} 件</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
