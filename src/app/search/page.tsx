import Link from "next/link"

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Search</p>
          <h1 className="text-4xl font-bold text-stone-900">Find the Right Pair</h1>
          <p className="text-stone-600">
            Start from the product catalog and use category or keyword filters to narrow things down.
          </p>
        </div>

        <form action="/products" className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <label htmlFor="search" className="mb-3 block text-sm font-medium text-stone-700">
            Search products
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="search"
              name="search"
              type="text"
              placeholder="Try pearl, hoop, crystal..."
              className="h-12 flex-1 rounded-xl border border-stone-300 px-4 text-stone-900 outline-none transition focus:border-stone-500"
            />
            <button
              type="submit"
              className="h-12 rounded-xl bg-stone-900 px-6 font-medium text-white transition hover:bg-stone-700"
            >
              Search
            </button>
          </div>
        </form>

        <div className="grid gap-3 sm:grid-cols-3">
          <Link href="/products?category=stud" className="rounded-2xl bg-stone-100 px-5 py-4 text-center text-stone-800 transition hover:bg-stone-200">
            Stud Earrings
          </Link>
          <Link href="/products?category=dangle" className="rounded-2xl bg-stone-100 px-5 py-4 text-center text-stone-800 transition hover:bg-stone-200">
            Dangle Earrings
          </Link>
          <Link href="/products?category=hoop" className="rounded-2xl bg-stone-100 px-5 py-4 text-center text-stone-800 transition hover:bg-stone-200">
            Hoop Earrings
          </Link>
        </div>
      </div>
    </div>
  )
}
