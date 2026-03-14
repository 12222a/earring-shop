"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Minus, Plus, ShoppingCart, ArrowLeft } from "lucide-react"

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
        alert("已添加到购物车！")
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
          <div className="h-96 bg-stone-200 rounded-xl"></div>
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Link href="/products" className="flex items-center text-stone-500 hover:text-[#D4A574] mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        返回商品列表
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
          <Image
            src={product.imageUrl || "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <span className="text-sm text-stone-500 uppercase tracking-wide">{product.category}</span>
            <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
          </div>

          <p className="text-3xl font-bold text-[#D4A574]">¥{Number(product.price).toFixed(2)}</p>

          <p className="text-stone-600 leading-relaxed">{product.description}</p>

          {product.stock <= 0 ? (
            <Card className="p-4 bg-red-50 border-red-200">
              <p className="text-red-600 text-center">该商品已售罄</p>
            </Card>
          ) : (
            <>
              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="text-stone-600">数量：</span>
                <div className="flex items-center border rounded-lg">
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
                <span className="text-sm text-stone-500">库存: {product.stock}件</span>
              </div>

              {/* Add to Cart Button */}
              <Button
                size="lg"
                className="w-full"
                style={{ backgroundColor: "#D4A574" }}
                onClick={addToCart}
                disabled={addingToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {addingToCart ? "添加中..." : "加入购物车"}
              </Button>
            </>
          )}

          {/* Features */}
          <div className="border-t pt-6 space-y-2">
            <div className="flex items-center text-sm text-stone-600">
              <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
              100% 正品保证
            </div>
            <div className="flex items-center text-sm text-stone-600">
              <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
              7天无理由退换
            </div>
            <div className="flex items-center text-sm text-stone-600">
              <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
              精美礼盒包装
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
