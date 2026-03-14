import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

// POST /api/webhook/stripe - Stripe 支付回调
export async function POST(request: NextRequest) {
  const payload = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    )
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  // 处理支付成功事件
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any
    const orderId = session.metadata?.orderId

    if (orderId) {
      try {
        // 更新订单状态为已支付
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            paymentId: session.payment_intent,
          },
        })

        console.log(`✅ Order ${orderId} marked as PAID`)

        // TODO: 发送邮件通知
        // await sendPaymentSuccessEmail(orderId)

      } catch (error) {
        console.error(`Failed to update order ${orderId}:`, error)
        return NextResponse.json(
          { error: "Failed to update order" },
          { status: 500 }
        )
      }
    }
  }

  // 处理支付失败事件
  if (event.type === "checkout.session.expired") {
    const session = event.data.object as any
    const orderId = session.metadata?.orderId

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      })
      console.log(`❌ Order ${orderId} cancelled due to expired session`)
    }
  }

  return NextResponse.json({ received: true })
}

// 禁用 body parser，Stripe 需要原始 body
export const config = {
  api: {
    bodyParser: false,
  },
}
