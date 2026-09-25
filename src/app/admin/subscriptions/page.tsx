import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, TrendingUp, Users, ArrowUpRight } from "lucide-react";

const OVERVIEW_STATS = [
  { label: "Active Subscriptions", value: "0", icon: CreditCard, color: "text-primary" },
  { label: "Monthly Revenue", value: "£0", icon: TrendingUp, color: "text-green-400" },
  { label: "Candidate Plans", value: "0", icon: Users, color: "text-blue-400" },
  { label: "Employer Plans", value: "0", icon: ArrowUpRight, color: "text-primary" },
];

export default function AdminSubscriptionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">
          Subscriptions
        </h1>
        <p className="mt-1 text-muted-foreground">
          Monitor subscription revenue and plan distribution.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {OVERVIEW_STATS.map((stat) => (
          <Card key={stat.label} className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`rounded-lg bg-muted p-2 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Plan Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <h2 className="font-heading text-lg font-semibold text-white">
              Candidate Plans
            </h2>
            <div className="mt-4 space-y-3">
              {["Free", "Recommended", "Complete Profile + CV"].map((plan) => (
                <div key={plan} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{plan}</span>
                  <span className="text-sm font-medium text-white">0</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <h2 className="font-heading text-lg font-semibold text-white">
              Employer Plans
            </h2>
            <div className="mt-4 space-y-3">
              {["Standard (£165)", "Ongoing Hiring (£295)", "Priority Search (£445)", "Professional / Agency (£675)"].map((plan) => (
                <div key={plan} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{plan}</span>
                  <span className="text-sm font-medium text-white">0</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <h2 className="font-heading text-lg font-semibold text-white">
            Recent Transactions
          </h2>
          <div className="mt-4 flex flex-col items-center py-8 text-center">
            <CreditCard className="h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              No transactions yet. Payment history will appear here once
              subscriptions start processing.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
