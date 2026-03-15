import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { isDatabaseConfigured } from "@/lib/database"
import { mockProducts } from "@/lib/mock-products"
import { getProductImageSrc } from "@/lib/product-images"

export const dynamic = "force-dynamic"

async function getProducts(searchParams: { [key: string]: string | string[] | undefined }) {
  const category = searchParams.category as string
  const search = searchParams.search as string

  if (!isDatabaseConfigured) {
    let filtered = mockProducts

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

    let filtered = mockProducts

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
          {products.map((product: Product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group">
              <div className="overflow-hidden rounded-xl bg-white shadow transition-shadow hover:shadow-lg">
                <div className="relative h-64 bg-stone-100">
                  <Image
                    src={getProductImageSrc(
                      "imageUrl" in product ? product.imageUrl : undefined,
                      "category" in product ? product.category : undefined
                    )}
                    alt={product.name}
                    fill
                    className="object-cover"
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
          ))}
        </div>
      )}
    </div>
  )
}
