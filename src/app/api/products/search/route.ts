import { NextRequest, NextResponse } from "next/server"
import { isDatabaseConfigured } from "@/lib/database"
import { prisma } from "@/lib/prisma"
import { mockProducts } from "@/lib/mock-products"

// GET /api/products/search?q=关键词&page=1&limit=10
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")
  const category = searchParams.get("category")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const sortBy = searchParams.get("sortBy") || "createdAt"
  const order = searchParams.get("order") || "desc"
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "12")
  const skip = (page - 1) * limit

  if (!isDatabaseConfigured) {
    let products = mockProducts.filter((product) => {
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q.toLowerCase()) ||
        product.description.toLowerCase().includes(q.toLowerCase())

      const matchesCategory = !category || category === "all" || product.category === category
      const matchesMinPrice = !minPrice || product.price >= parseFloat(minPrice)
      const matchesMaxPrice = !maxPrice || product.price <= parseFloat(maxPrice)

      return matchesQuery && matchesCategory && matchesMinPrice && matchesMaxPrice
    })

    products = [...products].sort((a, b) => {
      const direction = order === "asc" ? 1 : -1

      if (sortBy === "price") {
        return (a.price - b.price) * direction
      }

      if (sortBy === "name") {
        return a.name.localeCompare(b.name, "zh-CN") * direction
      }

      return (Number(b.featured) - Number(a.featured)) * direction
    })

    const pagedProducts = products.slice(skip, skip + limit)

    return NextResponse.json({
      products: pagedProducts,
      pagination: {
        page,
        limit,
        total: products.length,
        totalPages: Math.ceil(products.length / limit),
        hasMore: page * limit < products.length,
      },
      fallback: true,
    })
  }

  try {
    const where: any = {}

    // 搜索关键词
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ]
    }

    // 分类筛选
    if (category && category !== "all") {
      where.category = category
    }

    // 价格区间
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    // 排序配置
    const orderBy: any = {}
    if (sortBy === "price") {
      orderBy.price = order
    } else if (sortBy === "name") {
      orderBy.name = order
    } else {
      orderBy.createdAt = order
    }

    // 并行查询数据和总数
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    })
  } catch (error) {
    console.error("Search error:", error)

    let products = mockProducts.filter((product) => {
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q.toLowerCase()) ||
        product.description.toLowerCase().includes(q.toLowerCase())

      const matchesCategory = !category || category === "all" || product.category === category
      const matchesMinPrice = !minPrice || product.price >= parseFloat(minPrice)
      const matchesMaxPrice = !maxPrice || product.price <= parseFloat(maxPrice)

      return matchesQuery && matchesCategory && matchesMinPrice && matchesMaxPrice
    })

    products = [...products].sort((a, b) => {
      const direction = order === "asc" ? 1 : -1

      if (sortBy === "price") {
        return (a.price - b.price) * direction
      }

      if (sortBy === "name") {
        return a.name.localeCompare(b.name, "zh-CN") * direction
      }

      return (Number(b.featured) - Number(a.featured)) * direction
    })

    const pagedProducts = products.slice(skip, skip + limit)

    return NextResponse.json({
      products: pagedProducts,
      pagination: {
        page,
        limit,
        total: products.length,
        totalPages: Math.ceil(products.length / limit),
        hasMore: page * limit < products.length,
      },
      fallback: true,
    })
  }
}
