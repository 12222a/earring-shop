import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

async function getProducts(searchParams: { [key: string]: string | string[] | undefined }) {
  const category = searchParams.category as string
  const search = searchParams.search as string

  const where: any = {}

  if (category && category !== "all") {
    where.category = category
  }

  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive"
    }
  }

  return await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })
}

type Product = Awaited<ReturnType<typeof getProducts>>[number]

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const products = await getProducts(searchParams)
  const category = (searchParams.category as string) || "all"

  const categories = [
    { id: "all", name: "全部" },
    { id: "stud", name: "耳钉" },
    { id: "dangle", name: "耳环" },
    { id: "hoop", name: "耳圈" },
    { id: "clip", name: "耳夹" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">全部商品</h1>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/products?category=${cat.id}`}>
              <Button
                variant={category === cat.id ? "default" : "outline"}
                size="sm"
                style={category === cat.id ? { backgroundColor: "#D4A574" } : {}}
              >
                {cat.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-stone-500">暂无商品</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: Product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group">
              <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow">
                <div className="relative h-64">
                  <Image
                    src={product.imageUrl || "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-medium">已售罄</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-stone-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-stone-500 mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-[#D4A574] font-bold">¥{Number(product.price).toFixed(2)}</p>
                    {product.stock > 0 && product.stock < 10 && (
                      <span className="text-xs text-red-500">仅剩{product.stock}件</span>
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
