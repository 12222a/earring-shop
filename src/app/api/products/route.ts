import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 模拟产品数据
const mockProducts = [
  {
    id: "1",
    name: "珍珠耳环",
    description: "优雅淡水珍珠，简约精致",
    price: 299,
    imageUrl: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400",
    category: "stud",
    featured: true,
    stock: 10,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "金色耳圈",
    description: "18K镀金，时尚百搭",
    price: 199,
    imageUrl: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400",
    category: "hoop",
    featured: true,
    stock: 15,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "水晶耳坠",
    description: "施华洛世奇水晶，闪耀动人",
    price: 399,
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",
    category: "dangle",
    featured: true,
    stock: 8,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "钻石耳钉",
    description: "闪亮锆石，日常百搭",
    price: 159,
    imageUrl: "https://images.unsplash.com/photo-1635767798638-3e2523c0188c?w=400",
    category: "stud",
    featured: true,
    stock: 20,
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "流苏耳环",
    description: "优雅流苏，气质加分",
    price: 259,
    imageUrl: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400",
    category: "dangle",
    featured: false,
    stock: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "简约耳夹",
    description: "无耳洞也能戴",
    price: 129,
    imageUrl: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400",
    category: "clip",
    featured: false,
    stock: 30,
    createdAt: new Date().toISOString(),
  },
]

// GET /api/products - 获取商品列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const search = searchParams.get("search")

    let products = mockProducts

    if (category && category !== "all") {
      products = products.filter(p => p.category === category)
    }

    if (featured === "true") {
      products = products.filter(p => p.featured)
    }

    if (search) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(mockProducts)
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
