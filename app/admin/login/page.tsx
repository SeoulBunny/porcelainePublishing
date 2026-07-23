import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin sign-in",
  description: "Sign in to the Porcelain Publishing admin interface (UI mockup, no functional backend).",
  robots: { index: false, follow: false },
  alternates: { canonical: "/admin/login" },
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
