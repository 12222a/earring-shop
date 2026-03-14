import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/products - 获取商品列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const search = searchParams.get("search")

    const where: any = {}

    if (category && category !== "all") {
      where.category = category
    }

    if (featured === "true") {
      where.featured = true
    }

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive"
      }
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

// POST /api/products - 创建商品（仅管理员）
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, price, imageUrl, category, stock, featured } = body

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        category,
        stock,
        featured
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}
