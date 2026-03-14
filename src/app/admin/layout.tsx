import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Package, ShoppingBag, Users } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 text-white">
        <div className="p-6">
          <h2 className="text-xl font-bold" style={{ color: "#D4A574" }}>
            管理后台
          </h2>
        </div>
        <nav className="px-4 space-y-2">
          <Link
            href="/admin"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-stone-800"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>概览</span>
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-stone-800"
          >
            <Package className="h-5 w-5" />
            <span>商品管理</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-stone-800"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>订单管理</span>
          </Link>
          <Link
            href="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-stone-800 mt-8"
          >
            <span>返回前台</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-stone-50">
        {children}
      </main>
    </div>
  )
}
