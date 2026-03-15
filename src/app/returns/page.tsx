const returnSteps = [
  "Request a return within 7 days of delivery.",
  "Keep the item unworn and in its original packaging.",
  "Once approved, ship the item back using the instructions from support.",
]

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl space-y-8">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Returns</p>
          <h1 className="text-4xl font-bold text-stone-900">Return Policy</h1>
          <p className="text-stone-600">
            We want the shopping experience to feel easy, so the return flow is straightforward.
          </p>
        </div>

        <div className="grid gap-4">
          {returnSteps.map((step, index) => (
            <div key={step} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">Step {index + 1}</p>
              <p className="mt-2 text-stone-700">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
