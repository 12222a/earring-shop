"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StoreImage } from "@/components/store-image"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { getCategoryImage, getProductImageSrc } from "@/lib/product-images"

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    imageUrl: string
    stock: number
  }
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [authRequired, setAuthRequired] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart")
      if (res.ok) {
        const data = await res.json()
        setCartItems(data)
      } else if (res.status === 401) {
        setAuthRequired(true)
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      })

      if (res.ok) {
        if (newQuantity <= 0) {
          setCartItems(cartItems.filter((item) => item.id !== itemId))
        } else {
          setCartItems(
            cartItems.map((item) =>
              item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
          )
        }
      }
    } catch (error) {
      console.error("Error updating cart:", error)
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart?itemId=${itemId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setCartItems(cartItems.filter((item) => item.id !== itemId))
      }
    } catch (error) {
      console.error("Error removing item:", error)
    }
  }

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-stone-200 rounded w-1/4 mb-8"></div>
          <div className="h-32 bg-stone-200 rounded mb-4"></div>
          <div className="h-32 bg-stone-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    if (authRequired) {
      return (
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="mb-4 h-16 w-16 mx-auto text-stone-300" />
          <h1 className="mb-4 text-2xl font-bold">请先登录后查看购物车</h1>
          <p className="mb-8 text-stone-500">登录后可以同步你的购物车和收藏商品。</p>
          <Link href="/login">
            <Button style={{ backgroundColor: "#D4A574" }}>去登录</Button>
          </Link>
        </div>
      )
    }

    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-stone-300 mb-4" />
        <h1 className="text-2xl font-bold mb-4">购物车是空的</h1>
        <p className="text-stone-500 mb-8">快去挑选心仪的商品吧！</p>
        <Link href="/products">
          <Button style={{ backgroundColor: "#D4A574" }}>
            浏览商品
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">购物车</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex gap-4">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(246,241,234,0.95)_55%,_rgba(232,223,212,0.92))]">
                  <StoreImage
                    src={getProductImageSrc(item.product.imageUrl, undefined, "mini")}
                    fallbackSrc={getCategoryImage(undefined, "mini")}
                    alt={item.product.name}
                    fill
                    sizes="96px"
                    className="object-contain p-2"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.product.id}`}
                    className="font-medium hover:text-[#D4A574] truncate block"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-[#D4A574] font-bold mt-1">
                    ¥{Number(item.product.price).toFixed(2)}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border rounded-lg">
                      <button
                        className="p-2 hover:bg-stone-100"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button
                        className="p-2 hover:bg-stone-100"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <div>
          <Card className="p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4">订单摘要</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-stone-600">
                <span>商品小计</span>
                <span>¥{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>运费</span>
                <span>{total >= 299 ? "免费" : "¥10.00"}</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>合计</span>
                <span className="text-[#D4A574]">
                  ¥{(total >= 299 ? total : total + 10).toFixed(2)}
                </span>
              </div>
            </div>

            <Link href="/checkout">
              <Button className="w-full" size="lg" style={{ backgroundColor: "#D4A574" }}>
                去结算
              </Button>
            </Link>

            {total < 299 && (
              <p className="text-sm text-stone-500 text-center mt-4">
                还差 ¥{(299 - total).toFixed(2)} 即可享受免运费
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
