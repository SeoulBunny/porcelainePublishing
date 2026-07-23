import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a free Porcelain Publishing account to save journals and books to your shelf.",
  alternates: { canonical: "/auth/signup" },
};

export default function SignupPage() {
  return (
    <>
      <section data-section="signup-header" className="bg-porcelain px-4 pb-4 pt-16 text-center sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-sm">
          <h1 className="font-heading text-3xl text-ink sm:text-4xl">Create your account</h1>
          <p className="mt-3 text-sm text-slate">
            Save journals and books to your shelf and follow contributors across disciplines.
          </p>
        </div>
      </section>
      <AuthForm mode="signup" />
    </>
  );
}
