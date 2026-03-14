"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { ShoppingCart, User, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Header() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold" style={{ color: "#D4A574" }}>
            Elegant Earrings
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-sm font-medium hover:text-[#D4A574] transition-colors">
            首页
          </Link>
          <Link href="/products" className="text-sm font-medium hover:text-[#D4A574] transition-colors">
            全部商品
          </Link>
          <Link href="/products?category=stud" className="text-sm font-medium hover:text-[#D4A574] transition-colors">
            耳钉
          </Link>
          <Link href="/products?category=dangle" className="text-sm font-medium hover:text-[#D4A574] transition-colors">
            耳环
          </Link>
          <Link href="/products?category=hoop" className="text-sm font-medium hover:text-[#D4A574] transition-colors">
            耳圈
          </Link>
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          <Link href="/search" className="p-2 hover:bg-stone-100 rounded-full">
            <Search className="h-5 w-5" />
          </Link>

          <Link href="/cart" className="p-2 hover:bg-stone-100 rounded-full relative">
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {session ? (
            <div className="flex items-center space-x-2">
              <Link href={session.user?.role === "ADMIN" ? "/admin" : "/orders"}>
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <User className="h-4 w-4 mr-2" />
                  {session.user?.name || "我的账户"}
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                退出
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                登录
              </Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-stone-100 rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="flex flex-col p-4 space-y-2">
            <Link href="/" className="py-2 px-4 hover:bg-stone-100 rounded" onClick={() => setMobileMenuOpen(false)}>
              首页
            </Link>
            <Link href="/products" className="py-2 px-4 hover:bg-stone-100 rounded" onClick={() => setMobileMenuOpen(false)}>
              全部商品
            </Link>
            <Link href="/products?category=stud" className="py-2 px-4 hover:bg-stone-100 rounded" onClick={() => setMobileMenuOpen(false)}>
              耳钉
            </Link>
            <Link href="/products?category=dangle" className="py-2 px-4 hover:bg-stone-100 rounded" onClick={() => setMobileMenuOpen(false)}>
              耳环
            </Link>
            <Link href="/products?category=hoop" className="py-2 px-4 hover:bg-stone-100 rounded" onClick={() => setMobileMenuOpen(false)}>
              耳圈
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
