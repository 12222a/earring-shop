import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

// 模拟产品数据（无数据库时使用）
const mockProducts = [
  {
    id: "1",
    name: "珍珠耳环",
    description: "优雅淡水珍珠，简约精致",
    price: 299,
    imageUrl: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400",
    category: "stud",
    featured: true,
    stock: 10,
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "金色耳圈",
    description: "18K镀金，时尚百搭",
    price: 199,
    imageUrl: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400",
    category: "hoop",
    featured: true,
    stock: 15,
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "水晶耳坠",
    description: "施华洛世奇水晶，闪耀动人",
    price: 399,
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",
    category: "dangle",
    featured: true,
    stock: 8,
    createdAt: new Date(),
  },
  {
    id: "4",
    name: "钻石耳钉",
    description: "闪亮锆石，日常百搭",
    price: 159,
    imageUrl: "https://images.unsplash.com/photo-1635767798638-3e2523c0188c?w=400",
    category: "stud",
    featured: true,
    stock: 20,
    createdAt: new Date(),
  },
  {
    id: "5",
    name: "流苏耳环",
    description: "优雅流苏，气质加分",
    price: 259,
    imageUrl: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400",
    category: "dangle",
    featured: false,
    stock: 12,
    createdAt: new Date(),
  },
  {
    id: "6",
    name: "简约耳夹",
    description: "无耳洞也能戴",
    price: 129,
    imageUrl: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400",
    category: "clip",
    featured: false,
    stock: 30,
    createdAt: new Date(),
  },
]

async function getProducts(searchParams: { [key: string]: string | string[] | undefined }) {
  const category = searchParams.category as string
  const search = searchParams.search as string

  try {
    // 尝试从数据库获取
    const { prisma } = await import("@/lib/prisma")

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
  } catch {
    // 数据库不可用时使用模拟数据
    let filtered = mockProducts
    if (category && category !== "all") {
      filtered = filtered.filter(p => p.category === category)
    }
    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      )
    }
    return filtered
  }
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
