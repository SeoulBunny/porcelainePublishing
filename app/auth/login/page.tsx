import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Porcelain Publishing account.",
  alternates: { canonical: "/auth/login" },
};

export default function LoginPage() {
  return (
    <>
      <section data-section="login-header" className="bg-porcelain px-4 pb-4 pt-16 text-center sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-sm">
          <h1 className="font-heading text-3xl text-ink sm:text-4xl">Welcome back</h1>
          <p className="mt-3 text-sm text-slate">
            Log in to pick up your shelf and the contributors you follow.
          </p>
        </div>
      </section>
      <AuthForm mode="login" />
    </>
  );
}
