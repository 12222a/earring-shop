"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StoreImage } from "@/components/store-image"
import { getCategoryImage, getProductImageSrc } from "@/lib/product-images"

interface Order {
  id: string
  userId: string
  user: { name: string; email: string }
  total: number
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  address: string
  city: string
  phone: string
  createdAt: string
  orderItems: {
    id: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
      imageUrl: string
    }
  }[]
}

const statusMap = {
  PENDING: { label: "待支付", color: "bg-yellow-100 text-yellow-800" },
  PAID: { label: "已支付", color: "bg-green-100 text-green-800" },
  SHIPPED: { label: "已发货", color: "bg-blue-100 text-blue-800" },
  DELIVERED: { label: "已送达", color: "bg-gray-100 text-gray-800" },
  CANCELLED: { label: "已取消", color: "bg-red-100 text-red-800" },
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders")
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId: string, status: Order["status"]) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        setOrders(orders.map(order =>
          order.id === orderId ? { ...order, status } : order
        ))
      }
    } catch (error) {
      console.error("Error updating order:", error)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-stone-200 rounded w-1/4 mb-8"></div>
          <div className="h-64 bg-stone-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">订单管理</h1>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-stone-50">
                  <th className="text-left py-3 px-4">订单号</th>
                  <th className="text-left py-3 px-4">客户</th>
                  <th className="text-left py-3 px-4">商品</th>
                  <th className="text-left py-3 px-4">金额</th>
                  <th className="text-left py-3 px-4">状态</th>
                  <th className="text-left py-3 px-4">操作</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-stone-50">
                    <td className="py-3 px-4 font-mono text-sm">{order.id.slice(0, 8)}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{order.user?.name || "未知"}</p>
                        <p className="text-sm text-stone-500">{order.user?.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex -space-x-2">
                        {order.orderItems.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-white"
                          >
                            <StoreImage
                              src={getProductImageSrc(item.product.imageUrl, undefined, "mini")}
                              fallbackSrc={getCategoryImage(undefined, "mini")}
                              alt={item.product.name}
                              fill
                              sizes="32px"
                              className="object-contain p-0.5"
                            />
                          </div>
                        ))}
                        {order.orderItems.length > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-stone-200 flex items-center justify-center text-xs">
                            +{order.orderItems.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">
                      ¥{Number(order.total).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={statusMap[order.status].color}>
                        {statusMap[order.status].label}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {order.status === "PAID" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(order.id, "SHIPPED")}
                        >
                          发货
                        </Button>
                      )}
                      {order.status === "SHIPPED" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(order.id, "DELIVERED")}
                        >
                          确认送达
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
