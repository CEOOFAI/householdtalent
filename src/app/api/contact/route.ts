import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkIpRateLimit, ipFromRequest } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = ipFromRequest(request);
    const limit = checkIpRateLimit(ip, { max: 5, windowMs: 60_000 });
    if (!limit.ok) {
      return NextResponse.json(
        { success: false, message: "Too many submissions. Please try again in a minute." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
          },
        },
      );
    }
    const body = await request.json();
    // Honeypot field: real users leave this empty. Bots fill every input.
    if (body && typeof body === "object" && body.website) {
      return NextResponse.json({ success: true }, { status: 200 });
    }
    const {
      firstName,
      lastName,
      email,
      role,
      message,
      gdprConsent,
      marketingOptIn,
    } = body || {};

    if (!email || !message || !gdprConsent) {
      return NextResponse.json(
        { success: false, message: "Email, message, and privacy consent are required." },
        { status: 400 },
      );
    }

    const admin = createAdminClient();
    const now = new Date().toISOString();

    const { error } = await admin.from("contact_leads").insert({
      name: [firstName, lastName].filter(Boolean).join(" ") || "Anonymous",
      email,
      subject: role,
      message,
      gdpr_consent_at: now,
      marketing_consent: !!marketingOptIn,
      marketing_consent_at: marketingOptIn ? now : null,
      source: "contact_page",
    });

    if (error) {
      console.error("contact lead insert failed", { code: error.code });
      return NextResponse.json(
        { success: false, message: "Could not save your message. Please email us." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Message received. We will get back to you shortly." },
      { status: 200 },
    );
  } catch {
    console.error("contact endpoint error");
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
