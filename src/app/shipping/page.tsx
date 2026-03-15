const shippingNotes = [
  "订单通常会在 1 到 2 个工作日内完成处理并安排发出。",
  "部分活动商品或满额订单可享受包邮服务，具体以下单页为准。",
  "包裹出库后，我们会通过订单页或邮件同步物流信息。",
]

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl space-y-8">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-stone-500">配送</p>
          <h1 className="text-4xl font-bold text-stone-900">配送说明</h1>
          <p className="text-stone-600">
            这里整理了下单、包装和发货的基本说明，方便你在购买前快速了解。
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
