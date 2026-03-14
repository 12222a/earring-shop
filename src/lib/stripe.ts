import Stripe from "stripe"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia",
    })
  : null

export function getStripe(): Stripe {
  if (!stripe) {
    throw new Error("STRIPE_SECRET_KEY is not configured")
  }
  return stripe
}
