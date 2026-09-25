import { Card, CardContent } from "@/components/ui/card";
import { Bell, Shield, Download, Trash2 } from "lucide-react";
import {
  DeleteAccountButton,
  ExportDataButton,
} from "@/components/account-data-actions";

export default function CandidateSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account preferences and data.
        </p>
      </div>

      <div className="space-y-4">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-muted p-2 text-muted-foreground">
              <Bell className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Email notification preferences coming soon.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-muted p-2 text-muted-foreground">
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">Privacy</h3>
              <p className="text-sm text-muted-foreground">
                Profile visibility and data sharing settings coming soon.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="flex items-start gap-4 p-6">
            <div className="rounded-lg bg-muted p-2 text-muted-foreground">
              <Download className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">Download my data</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get a copy of every piece of information we hold on you,
                including profile, introductions, and signed download links
                for your photo and CV. JSON file.
              </p>
              <div className="mt-4">
                <ExportDataButton />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="flex items-start gap-4 p-6">
            <div className="rounded-lg bg-red-500/10 p-2 text-red-400">
              <Trash2 className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">Delete account</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Permanently remove your account and every piece of data
                associated with it. This is not reversible.
              </p>
              <div className="mt-4">
                <DeleteAccountButton />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
