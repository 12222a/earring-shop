const returnSteps = [
  "请在签收后的 7 天内提交退换申请，并说明订单号与原因。",
  "商品需保持未佩戴、配件齐全，并保留原包装后再寄回。",
  "审核通过后，我们会通过客服或邮件提供退回地址与后续处理说明。",
]

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl space-y-8">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-stone-500">退换</p>
          <h1 className="text-4xl font-bold text-stone-900">退换政策</h1>
          <p className="text-stone-600">
            我们希望购物过程尽量轻松透明，所以把退换流程整理成了下面这几步。
          </p>
        </div>

        <div className="grid gap-4">
          {returnSteps.map((step, index) => (
            <div key={step} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
                步骤 {index + 1}
              </p>
              <p className="mt-2 text-stone-700">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
