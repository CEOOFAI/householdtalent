import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amountInPence: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: amountInPence % 100 === 0 ? 0 : 2,
  }).format(amountInPence / 100);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function generateCandidateSlug(firstName: string, lastName: string): string {
  const base = slugify(`${firstName}-${lastName}`);
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}
