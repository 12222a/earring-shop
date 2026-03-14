"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
  const router = useRouter()

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
        router.push("/login")
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
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-stone-200 rounded w-1/4"></div>
          <div className="h-32 bg-stone-200 rounded"></div>
          <div className="h-32 bg-stone-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">我的订单</h1>

      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-stone-500 mb-4">暂无订单</p>
          <Link href="/products" className="text-[#D4A574] hover:underline">
            去购物 →
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-stone-500">订单号: {order.id}</p>
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
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={item.product.imageUrl || "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=100"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="font-medium hover:text-[#D4A574]"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-stone-500">
                        数量: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      ¥{Number(item.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between items-center">
                <p className="text-stone-600">
                  共 {order.orderItems.length} 件商品
                </p>
                <p className="text-xl font-bold text-[#D4A574]">
                  合计: ¥{Number(order.total).toFixed(2)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
