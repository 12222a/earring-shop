import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export const dynamic = "force-dynamic"

// 模拟产品数据（无数据库时使用）
const mockProducts = [
  {
    id: "1",
    name: "珍珠耳环",
    description: "优雅淡水珍珠",
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
    description: "18K镀金",
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
    description: "施华洛世奇水晶",
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
    description: "闪亮锆石",
    price: 159,
    imageUrl: "https://images.unsplash.com/photo-1635767798638-3e2523c0188c?w=400",
    category: "stud",
    featured: true,
    stock: 20,
    createdAt: new Date(),
  },
]

async function getFeaturedProducts() {
  try {
    // 尝试从数据库获取
    const { prisma } = await import("@/lib/prisma")
    return await prisma.product.findMany({
      where: { featured: true },
      take: 4,
      orderBy: { createdAt: "desc" },
    })
  } catch {
    // 数据库不可用时使用模拟数据
    return mockProducts
  }
}

type FeaturedProduct = Awaited<ReturnType<typeof getFeaturedProducts>>[number]

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-stone-100 to-stone-200 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                发现你的
                <span style={{ color: "#D4A574" }}> 独特魅力</span>
              </h1>
              <p className="text-lg text-stone-600 max-w-lg">
                精选全球顶级设计师耳饰作品，每一件都是彰显个性的艺术品。
                从简约日常款到华丽宴会款，为你的每一刻增添光彩。
              </p>
              <div className="flex gap-4">
                <Link href="/products">
                  <Button size="lg" style={{ backgroundColor: "#D4A574" }}>
                    浏览商品
                  </Button>
                </Link>
                <Link href="/products?category=stud">
                  <Button variant="outline" size="lg">
                    耳钉系列
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1635767798638-3e2523c0188c?w=800"
                alt="精美耳饰展示"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">商品分类</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CategoryCard
              title="耳钉"
              description="简约精致，日常百搭"
              image="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400"
              href="/products?category=stud"
            />
            <CategoryCard
              title="耳环"
              description="优雅灵动，彰显气质"
              image="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400"
              href="/products?category=dangle"
            />
            <CategoryCard
              title="耳圈"
              description="时尚前卫，个性十足"
              image="https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400"
              href="/products?category=hoop"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">热销推荐</h2>
            <Link href="/products" className="text-[#D4A574] hover:underline">
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: FeaturedProduct) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <FeatureItem
              icon="🚚"
              title="免费配送"
              description="订单满299元免运费"
            />
            <FeatureItem
              icon="✨"
              title="品质保证"
              description="100%正品保证"
            />
            <FeatureItem
              icon="🔄"
              title="7天退换"
              description="无忧退换货服务"
            />
            <FeatureItem
              icon="💎"
              title="精美包装"
              description="送礼自用两相宜"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function CategoryCard({
  title,
  description,
  image,
  href,
}: {
  title: string
  description: string
  image: string
  href: string
}) {
  return (
    <Link href={href} className="group">
      <div className="relative h-64 rounded-xl overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          <p className="text-sm opacity-90">{description}</p>
        </div>
      </div>
    </Link>
  )
}

function ProductCard({ product }: { product: FeaturedProduct }) {
  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow">
        <div className="relative h-64">
          <Image
            src={product.imageUrl || "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-stone-900 mb-2">{product.name}</h3>
          <p className="text-[#D4A574] font-bold">¥{Number(product.price).toFixed(2)}</p>
        </div>
      </div>
    </Link>
  )
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="space-y-2">
      <div className="text-4xl">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-stone-600">{description}</p>
    </div>
  )
}
