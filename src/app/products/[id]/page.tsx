"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StoreImage } from "@/components/store-image"
import { getCategoryImage, getProductImageSrc } from "@/lib/product-images"

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  stock: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setProduct(data)
      }
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async () => {
    if (!product) return

    setAddingToCart(true)
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      })

      if (res.ok) {
        alert("已加入购物车")
      } else {
        alert("请先登录")
        window.location.href = "/login"
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 rounded-xl bg-stone-200"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-stone-500">商品不存在</p>
        <Link href="/products">
          <Button variant="outline" className="mt-4">
            返回商品列表
          </Button>
        </Link>
      </div>
    )
  }

  const imageSrc = getProductImageSrc(product.imageUrl, product.category, "detail")
  const fallbackSrc = getCategoryImage(product.category, "detail")

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/products" className="mb-6 flex items-center text-stone-500 hover:text-[#D4A574]">
        <ArrowLeft className="mr-1 h-4 w-4" />
        返回商品列表
      </Link>

      <div className="grid gap-12 md:grid-cols-2">
        <div className="relative h-96 overflow-hidden rounded-2xl border border-stone-200 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(246,241,234,0.95)_55%,_rgba(232,223,212,0.92))] md:h-[540px]">
          <StoreImage
            src={imageSrc}
            fallbackSrc={fallbackSrc}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-contain p-6 md:p-10"
          />
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-sm uppercase tracking-wide text-stone-500">{product.category}</span>
            <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          </div>

          <p className="text-3xl font-bold text-[#D4A574]">¥{Number(product.price).toFixed(2)}</p>
          <p className="leading-relaxed text-stone-600">{product.description}</p>

          {product.stock <= 0 ? (
            <Card className="border-red-200 bg-red-50 p-4">
              <p className="text-center text-red-600">该商品已售罄</p>
            </Card>
          ) : (
            <>
              <div className="flex items-center space-x-4">
                <span className="text-stone-600">数量：</span>
                <div className="flex items-center rounded-lg border">
                  <button
                    className="p-2 hover:bg-stone-100"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    className="p-2 hover:bg-stone-100"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-stone-500">库存：{product.stock} 件</span>
              </div>

              <Button
                size="lg"
                className="w-full"
                style={{ backgroundColor: "#D4A574" }}
                onClick={addToCart}
                disabled={addingToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {addingToCart ? "加入中..." : "加入购物车"}
              </Button>
            </>
          )}

          <div className="space-y-2 border-t pt-6">
            <div className="flex items-center text-sm text-stone-600">
              <span className="mr-2 h-4 w-4 rounded-full bg-green-500"></span>
              100% 正品保证
            </div>
            <div className="flex items-center text-sm text-stone-600">
              <span className="mr-2 h-4 w-4 rounded-full bg-green-500"></span>
              7 天无理由退换
            </div>
            <div className="flex items-center text-sm text-stone-600">
              <span className="mr-2 h-4 w-4 rounded-full bg-green-500"></span>
              精美礼盒包装
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
