"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { StoreImage } from "@/components/store-image"
import { getCategoryImage, getProductImageSrc } from "@/lib/product-images"

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    imageUrl: string
  }
}

interface Order {
  id: string
  total: number
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  createdAt: string
  orderItems: OrderItem[]
}

const statusMap = {
  PENDING: { label: "待支付", color: "bg-yellow-100 text-yellow-800" },
  PAID: { label: "已支付", color: "bg-green-100 text-green-800" },
  SHIPPED: { label: "已发货", color: "bg-blue-100 text-blue-800" },
  DELIVERED: { label: "已送达", color: "bg-gray-100 text-gray-800" },
  CANCELLED: { label: "已取消", color: "bg-red-100 text-red-800" },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [authRequired, setAuthRequired] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders")

      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      } else if (res.status === 401) {
        setAuthRequired(true)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-1/4 rounded bg-stone-200"></div>
          <div className="h-32 rounded bg-stone-200"></div>
          <div className="h-32 rounded bg-stone-200"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">我的订单</h1>

      {authRequired ? (
        <Card className="p-12 text-center">
          <p className="mb-4 text-stone-500">请先登录后查看订单记录。</p>
          <Link href="/login" className="text-[#D4A574] hover:underline">
            去登录 →
          </Link>
        </Card>
      ) : orders.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="mb-4 text-stone-500">暂时还没有订单。</p>
          <Link href="/products" className="text-[#D4A574] hover:underline">
            去逛逛 →
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-sm text-stone-500">订单号：{order.id}</p>
                  <p className="text-sm text-stone-500">
                    {new Date(order.createdAt).toLocaleDateString("zh-CN")}
                  </p>
                </div>
                <Badge className={statusMap[order.status].color}>
                  {statusMap[order.status].label}
                </Badge>
              </div>

              <div className="space-y-3">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(246,241,234,0.95)_55%,_rgba(232,223,212,0.92))]">
                      <StoreImage
                        src={getProductImageSrc(item.product.imageUrl, undefined, "mini")}
                        fallbackSrc={getCategoryImage(undefined, "mini")}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-contain p-1.5"
                      />
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="font-medium hover:text-[#D4A574]"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-stone-500">数量：{item.quantity}</p>
                    </div>
                    <p className="font-medium">¥{Number(item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <p className="text-stone-600">共 {order.orderItems.length} 件商品</p>
                <p className="text-xl font-bold text-[#D4A574]">
                  合计：¥{Number(order.total).toFixed(2)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
