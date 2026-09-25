import type { Metadata } from "next";
import { NotFoundPanel } from "@/components/not-found-panel";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return <NotFoundPanel />;
}
