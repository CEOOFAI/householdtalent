import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Check } from "lucide-react";

const TIERS = [
  {
    name: "Standard",
    price: "£165",
    description: "30 days access",
    features: [
      "1 live role at any time",
      "Replace roles as filled within 30 days",
      "Professionally structured role",
      "Access to curated candidates",
      "Filtered introductions",
    ],
    current: true,
  },
  {
    name: "Ongoing Hiring",
    price: "£295",
    description: "30 days access",
    features: [
      "Up to 2 live roles at any time",
      "Replace roles as filled within 30 days",
      "Increased visibility",
      "Faster candidate exposure",
    ],
    current: false,
  },
  {
    name: "Priority Search",
    price: "£445",
    description: "30 days access",
    features: [
      "Everything in Ongoing Hiring",
      "Featured placement across platform",
      "Curated shortlist delivered",
      "Role profile + NDA templates included",
    ],
    current: false,
  },
  {
    name: "Professional / Agency",
    price: "£675",
    description: "30 days access",
    features: [
      "Up to 5 live roles at any time",
      "Replace roles as filled within 30 days",
      "Designed for agencies & multi-role hiring",
      "Priority visibility across all roles",
    ],
    current: false,
  },
];

export default function EmployerSubscriptionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">Subscription</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your hiring plan and billing.
        </p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-4 p-4 sm:p-6">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Plan</p>
            <p className="text-lg font-semibold text-white">Standard</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((tier) => (
          <Card
            key={tier.name}
            className={`border-border bg-card ${
              tier.current ? "ring-2 ring-primary" : ""
            }`}
          >
            <CardContent className="p-4 sm:p-6">
              <h3 className="font-heading text-lg font-semibold text-white">
                {tier.name}
              </h3>
              <p className="mt-1 text-2xl font-bold text-primary">{tier.price}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {tier.description}
              </p>
              <ul className="mt-4 space-y-2">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                disabled={tier.current}
                className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {tier.current ? "Current Plan" : "Upgrade"}
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
