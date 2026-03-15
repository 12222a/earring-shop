import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { mockProducts } from "@/lib/mock-products"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const search = searchParams.get("search")

    let products = mockProducts

    if (category && category !== "all") {
      products = products.filter((product) => product.category === category)
    }

    if (featured === "true") {
      products = products.filter((product) => product.featured)
    }

    if (search) {
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    return NextResponse.json(products)
  } catch {
    return NextResponse.json(mockProducts)
  }
}

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
        featured,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Failed to create product:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}
