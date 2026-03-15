const shippingNotes = [
  "Orders are usually processed within 1-2 business days.",
  "Free shipping is available on qualifying orders.",
  "Tracking details are sent after the package leaves the warehouse.",
]

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl space-y-8">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Shipping</p>
          <h1 className="text-4xl font-bold text-stone-900">Delivery Information</h1>
          <p className="text-stone-600">
            Here is a quick overview of how we process, pack, and ship each order.
          </p>
        </div>

        <div className="grid gap-4">
          {shippingNotes.map((note) => (
            <div key={note} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <p className="text-stone-700">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
