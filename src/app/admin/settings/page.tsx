import { Card, CardContent } from "@/components/ui/card";
import { Settings, Globe, CreditCard, Shield, Bell } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">
          Admin Settings
        </h1>
        <p className="mt-1 text-muted-foreground">
          Platform configuration and management.
        </p>
      </div>

      <div className="space-y-4">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-muted p-2 text-muted-foreground">
              <Globe className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">Platform Settings</h3>
              <p className="text-sm text-muted-foreground">
                Site name, domain, regions, and general configuration.
              </p>
            </div>
            <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
              Coming Soon
            </span>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-muted p-2 text-muted-foreground">
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">Stripe Configuration</h3>
              <p className="text-sm text-muted-foreground">
                API keys, webhook endpoints, and product pricing.
              </p>
            </div>
            <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
              Coming Soon
            </span>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-muted p-2 text-muted-foreground">
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">Moderation</h3>
              <p className="text-sm text-muted-foreground">
                Content moderation rules and auto-review settings.
              </p>
            </div>
            <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
              Coming Soon
            </span>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-muted p-2 text-muted-foreground">
              <Bell className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">Email Templates</h3>
              <p className="text-sm text-muted-foreground">
                Customise transactional emails and notification templates.
              </p>
            </div>
            <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
              Coming Soon
            </span>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-muted p-2 text-muted-foreground">
              <Settings className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">Admin Users</h3>
              <p className="text-sm text-muted-foreground">
                Manage admin access and role permissions.
              </p>
            </div>
            <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
              Coming Soon
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
