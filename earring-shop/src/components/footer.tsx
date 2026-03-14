import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-stone-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold" style={{ color: "#D4A574" }}>
              Elegant Earrings
            </h3>
            <p className="text-sm text-stone-600">
              发现精美耳饰，彰显你的独特魅力。每一件都是精心设计的艺术品。
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">快速链接</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>
                <Link href="/products" className="hover:text-[#D4A574]">
                  全部商品
                </Link>
              </li>
              <li>
                <Link href="/products?category=stud" className="hover:text-[#D4A574]">
                  耳钉系列
                </Link>
              </li>
              <li>
                <Link href="/products?category=dangle" className="hover:text-[#D4A574]">
                  耳环系列
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-semibold">客户服务</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>
                <Link href="/orders" className="hover:text-[#D4A574]">
                  订单查询
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-[#D4A574]">
                  配送说明
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-[#D4A574]">
                  退换政策
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">联系我们</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>邮箱: hello@elegantearrings.com</li>
              <li>电话: 400-123-4567</li>
              <li>工作时间: 周一至周五 9:00-18:00</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-stone-500">
          <p>© 2024 Elegant Earrings. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
