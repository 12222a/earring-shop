import Link from "next/link"

const quickCategories = [
  { href: "/products?category=stud", label: "耳钉系列" },
  { href: "/products?category=dangle", label: "耳环系列" },
  { href: "/products?category=hoop", label: "耳圈系列" },
]

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-stone-500">搜索</p>
          <h1 className="text-4xl font-bold text-stone-900">快速找到心仪耳饰</h1>
          <p className="text-stone-600">
            可以直接搜索商品关键词，或者先按分类浏览，再慢慢挑选适合你的款式。
          </p>
        </div>

        <form action="/products" className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <label htmlFor="search" className="mb-3 block text-sm font-medium text-stone-700">
            搜索商品
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="search"
              name="search"
              type="text"
              placeholder="试试输入：珍珠、耳圈、水晶..."
              className="h-12 flex-1 rounded-xl border border-stone-300 px-4 text-stone-900 outline-none transition focus:border-stone-500"
            />
            <button
              type="submit"
              className="h-12 rounded-xl bg-stone-900 px-6 font-medium text-white transition hover:bg-stone-700"
            >
              开始搜索
            </button>
          </div>
        </form>

        <div className="grid gap-3 sm:grid-cols-3">
          {quickCategories.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl bg-stone-100 px-5 py-4 text-center text-stone-800 transition hover:bg-stone-200"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
