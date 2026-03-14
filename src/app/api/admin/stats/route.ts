import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/admin/stats - 后台统计数据
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "week" // week, month, year

    // 计算时间范围
    const now = new Date()
    let startDate = new Date()

    if (period === "week") {
      startDate.setDate(now.getDate() - 7)
    } else if (period === "month") {
      startDate.setMonth(now.getMonth() - 1)
    } else if (period === "year") {
      startDate.setFullYear(now.getFullYear() - 1)
    }

    // 并行查询统计数据
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      recentOrders,
      topProducts,
      salesByDay,
    ] = await Promise.all([
      // 商品总数
      prisma.product.count(),

      // 订单总数
      prisma.order.count(),

      // 用户总数
      prisma.user.count(),

      // 总收入
      prisma.order.aggregate({
        where: { status: "PAID" },
        _sum: { total: true },
      }),

      // 最近7天订单
      prisma.order.findMany({
        where: {
          createdAt: { gte: startDate },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          user: { select: { name: true, email: true } },
          _count: { select: { orderItems: true } },
        },
      }),

      // 热销商品
      prisma.orderItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),

      // 每日销售统计
      prisma.$queryRaw`
        SELECT
          DATE(created_at) as date,
          COUNT(*) as orderCount,
          SUM(total) as revenue
        FROM "Order"
        WHERE created_at >= ${startDate}
          AND status = 'PAID'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,
    ])

    // 获取热销商品详情
    const topProductIds = topProducts.map((p: { productId: string }) => p.productId)
    const topProductDetails = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true, imageUrl: true },
    })

    const topProductsWithDetails = topProducts.map((tp: { productId: string; _sum: { quantity: number | null } }) => ({
      ...tp,
      product: topProductDetails.find((p: { id: string }) => p.id === tp.productId),
    }))

    return NextResponse.json({
      overview: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: totalRevenue._sum.total || 0,
      },
      recentOrders,
      topProducts: topProductsWithDetails,
      salesByDay,
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
