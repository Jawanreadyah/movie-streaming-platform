import { PricingSection } from "@/components/ui/pricing-section";

export const PAYMENT_FREQUENCIES = ["monthly", "yearly"];

export const TIERS = [
  {
    id: "basic",
    name: "Basic",
    price: {
      monthly: 9.99,
      yearly: 7.99,
    },
    description: "Perfect for casual viewers",
    features: [
      "HD streaming quality",
      "Watch on 1 device at a time",
      "Ad-free viewing experience",
      "Download on 1 device",
      "Cancel anytime",
    ],
    cta: "Start Streaming",
  },
  {
    id: "standard",
    name: "Standard",
    price: {
      monthly: 14.99,
      yearly: 11.99,
    },
    description: "Great for families",
    features: [
      "Full HD streaming quality",
      "Watch on 2 devices at once",
      "Ad-free viewing experience",
      "Download on 2 devices",
      "Create 5 viewer profiles",
    ],
    cta: "Start Streaming",
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: {
      monthly: 19.99,
      yearly: 15.99,
    },
    description: "Ultimate entertainment",
    features: [
      "4K Ultra HD + HDR",
      "Watch on 4 devices at once",
      "Spatial Audio support",
      "Download on 6 devices",
      "Create 10 viewer profiles",
    ],
    cta: "Start Streaming",
  },
  {
    id: "enterprise",
    name: "Business",
    price: {
      monthly: "Custom",
      yearly: "Custom",
    },
    description: "For organizations & events",
    features: [
      "Everything in Premium",
      "Public viewing license",
      "API access",
      "Dedicated support",
      "Custom branding options",
    ],
    cta: "Contact Sales",
    highlighted: true,
  },
];

export function PricingSectionDemo() {
  return (
    <div className="relative flex justify-center items-center w-full mt-20 scale-90">
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:35px_35px] opacity-30 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>
      <PricingSection
        title="Choose Your Plans Coming soon!"
        subtitle="Unlock unlimited entertainment with our flexible streaming plans Coming soon!"
        frequencies={PAYMENT_FREQUENCIES}
        tiers={TIERS}
      />
    </div>
  );
}