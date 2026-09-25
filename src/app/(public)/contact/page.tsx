"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Clock, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Employer looking for staff");
  const [message, setMessage] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Preselect the enquiry type when arriving from /agencies (?type=agency).
  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get("type");
    if (type === "agency") setRole("Recruitment agency");
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!gdprConsent) {
      setError("Please confirm you have read the Privacy Policy before sending.");
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          role,
          message,
          gdprConsent,
          marketingOptIn,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please email us directly at hello@householdtalent.com");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-3xl font-bold text-white sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Whether you are a private household, a family office, a recruitment
            agency or a professional in private service, we would be glad to
            hear from you.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <Card className="border-border bg-card">
            <CardContent className="p-8">
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#9B7B3C]/10">
                    <Mail className="h-6 w-6 text-[#9B7B3C]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Message Sent</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We aim to respond within 24 hours on business days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                      {error}
                    </div>
                  )}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-white placeholder:text-muted-foreground"
                        placeholder="Your first name"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-white placeholder:text-muted-foreground"
                        placeholder="Your last name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-white placeholder:text-muted-foreground"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      I am a...
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground"
                    >
                      <option>Employer looking for staff</option>
                      <option>Candidate looking for work</option>
                      <option>Recruitment agency</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-white placeholder:text-muted-foreground"
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  <div className="space-y-3 rounded-md border border-border bg-background/40 p-3">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gdprConsent}
                        onChange={(e) => setGdprConsent(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#9B7B3C]"
                      />
                      <span className="text-xs text-muted-foreground">
                        <span className="text-red-400">*</span> I have read and
                        accept the{" "}
                        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#9B7B3C] hover:underline">Privacy Policy</a>
                        . I consent to my contact details being stored so the
                        team can reply to my message.
                      </span>
                    </label>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={marketingOptIn}
                        onChange={(e) => setMarketingOptIn(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#9B7B3C]"
                      />
                      <span className="text-xs text-muted-foreground">
                        Optional: send me occasional updates about new role
                        types and platform news. Unsubscribe at any time.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !gdprConsent}
                    className="w-full rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="border-border bg-card">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="rounded-lg bg-muted p-2 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Email</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    hello@householdtalent.com
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="rounded-lg bg-muted p-2 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Location</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Gibraltar, the Costa del Sol and internationally
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="rounded-lg bg-muted p-2 text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Response Time</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We aim to respond within 24 hours on business days.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
