import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StoreImage } from "@/components/store-image"
import { isDatabaseConfigured } from "@/lib/database"
import { mockProducts } from "@/lib/mock-products"
import { getCategoryImage, getProductImageSrc, heroImageSrc } from "@/lib/product-images"

export const dynamic = "force-dynamic"

async function getFeaturedProducts() {
  if (!isDatabaseConfigured) {
    return mockProducts.filter((product) => product.featured).slice(0, 4)
  }

  try {
    const { prisma } = await import("@/lib/prisma")

    return await prisma.product.findMany({
      where: { featured: true },
      take: 4,
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("Failed to load featured products:", error)
    return mockProducts.filter((product) => product.featured).slice(0, 4)
  }
}

type FeaturedProduct = Awaited<ReturnType<typeof getFeaturedProducts>>[number]

const categories = [
  {
    id: "stud",
    title: "耳钉",
    description: "简约精致，适合日常佩戴",
  },
  {
    id: "dangle",
    title: "耳环",
    description: "灵动垂坠，更显气质层次",
  },
  {
    id: "hoop",
    title: "耳圈",
    description: "线条利落，轻松搭出态度",
  },
]

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div>
      <section className="relative bg-gradient-to-r from-stone-100 to-stone-200 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                发现你的
                <span style={{ color: "#D4A574" }}> 独特魅力</span>
              </h1>
              <p className="max-w-lg text-lg text-stone-600">
                精选设计感耳饰作品，从简约日常款到宴会亮点款，让每一次出场都更有光彩。
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

            <div className="relative ml-auto h-[28rem] w-full max-w-[26rem] overflow-hidden rounded-[28px] border border-white/70 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(244,239,232,0.95)_58%,_rgba(229,221,210,0.92))] shadow-2xl md:h-[34rem] md:max-w-[28rem]">
              <StoreImage
                src={heroImageSrc}
                fallbackSrc={getCategoryImage("dangle", "detail")}
                alt="精美耳饰展示"
                fill
                priority
                sizes="(min-width: 1024px) 28rem, (min-width: 768px) 40vw, 100vw"
                className="object-contain p-5 md:p-7"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">商品分类</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                title={category.title}
                description={category.description}
                image={getCategoryImage(category.id, "category")}
                href={`/products?category=${category.id}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold">热销推荐</h2>
            <Link href="/products" className="text-[#D4A574] hover:underline">
              查看全部 →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product: FeaturedProduct) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-4">
            <FeatureItem icon="🚚" title="免费配送" description="订单满 299 元免运费" />
            <FeatureItem icon="✨" title="品质保证" description="精选材质，细节清晰可见" />
            <FeatureItem icon="🔄" title="7 天退换" description="支持无忧退换服务" />
            <FeatureItem icon="💎" title="精美包装" description="自用送礼都很合适" />
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
      <div className="relative h-64 overflow-hidden rounded-xl bg-stone-100">
        <StoreImage
          src={image}
          fallbackSrc={getCategoryImage("stud", "category")}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover object-[center_38%] transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h3 className="mb-1 text-xl font-bold">{title}</h3>
          <p className="text-sm opacity-90">{description}</p>
        </div>
      </div>
    </Link>
  )
}

function ProductCard({ product }: { product: FeaturedProduct }) {
  const category = "category" in product ? product.category : undefined
  const imageSrc = getProductImageSrc(
    "imageUrl" in product ? product.imageUrl : undefined,
    category,
    "card"
  )
  const fallbackSrc = getCategoryImage(category, "card")

  return (
    <Link href={`/products/${product.id}`} className="group">
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
        </div>
        <div className="p-4">
          <h3 className="mb-2 font-medium text-stone-900">{product.name}</h3>
          <p className="font-bold text-[#D4A574]">¥{Number(product.price).toFixed(2)}</p>
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
