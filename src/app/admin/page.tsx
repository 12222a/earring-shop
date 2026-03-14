import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingBag, Users, DollarSign } from "lucide-react"

export const dynamic = "force-dynamic"

async function getStats() {
  const [
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      where: { status: "PAID" },
      _sum: { total: true }
    })
  ])

  return {
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue: totalRevenue._sum.total || 0
  }
}

async function getRecentOrders() {
  return await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      orderItems: true
    }
  })
}

type RecentOrder = Awaited<ReturnType<typeof getRecentOrders>>[number]

export default async function AdminDashboard() {
  const stats = await getStats()
  const recentOrders = await getRecentOrders()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">后台概览</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="商品总数"
          value={stats.totalProducts}
          icon={Package}
          color="bg-blue-500"
        />
        <StatCard
          title="订单总数"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="bg-green-500"
        />
        <StatCard
          title="用户总数"
          value={stats.totalUsers}
          icon={Users}
          color="bg-purple-500"
        />
        <StatCard
          title="总收入"
          value={`¥${Number(stats.totalRevenue).toFixed(2)}`}
          icon={DollarSign}
          color="bg-yellow-500"
        />
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>最近订单</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">订单号</th>
                  <th className="text-left py-3 px-4">客户</th>
                  <th className="text-left py-3 px-4">金额</th>
                  <th className="text-left py-3 px-4">状态</th>
                  <th className="text-left py-3 px-4">时间</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: RecentOrder) => (
                  <tr key={order.id} className="border-b hover:bg-stone-50">
                    <td className="py-3 px-4 font-mono text-sm">{order.id.slice(0, 8)}</td>
                    <td className="py-3 px-4">{order.user.name || order.user.email}</td>
                    <td className="py-3 px-4">¥{Number(order.total).toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === "PAID"
                          ? "bg-green-100 text-green-800"
                          : order.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {order.status === "PAID"
                          ? "已支付"
                          : order.status === "PENDING"
                          ? "待支付"
                          : order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-stone-500">
                      {new Date(order.createdAt).toLocaleDateString("zh-CN")}
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

function StatCard({
  title,
  value,
  icon: Icon,
  color
}: {
  title: string
  value: string | number
  icon: any
  color: string
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`${color} p-3 rounded-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-stone-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
