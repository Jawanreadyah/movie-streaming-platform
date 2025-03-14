import { Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface PricingTier {
  id: string
  name: string
  price: {
    monthly: string | number
    yearly: string | number
  }
  description: string
  features: string[]
  cta: string
  popular?: boolean
  highlighted?: boolean
}

interface PricingCardProps {
  tier: PricingTier
  paymentFrequency: string
}

export function PricingCard({ tier, paymentFrequency }: PricingCardProps) {
  const price = tier.price[paymentFrequency as keyof typeof tier.price]
  const priceString = typeof price === "number" ? `$${price}` : price

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-8",
        tier.highlighted
          ? "border-transparent bg-gradient-to-b from-neutral-800 to-neutral-900 shadow-2xl shadow-neutral-900/50"
          : "border-neutral-800 bg-neutral-900/50 backdrop-blur-xl"
      )}
    >
      {tier.popular && (
        <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-1 text-sm font-medium text-white">
          Most Popular
        </div>
      )}

      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">{tier.name}</h2>
        <p className="mt-2 text-sm text-neutral-400">{tier.description}</p>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline">
          <span className="text-4xl font-bold text-white">{priceString}</span>
          {typeof price === "number" && (
            <span className="ml-2 text-neutral-400">/{paymentFrequency}</span>
          )}
        </div>
      </div>

      <ul className="mb-8 space-y-4 text-sm">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-center text-neutral-300">
            <Check className="mr-3 h-5 w-5 text-green-500" />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        className={cn(
          "mt-auto w-full",
          tier.highlighted
            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
            : "bg-white text-black hover:bg-neutral-200"
        )}
      >
        {tier.cta}
      </Button>
    </div>
  )
}