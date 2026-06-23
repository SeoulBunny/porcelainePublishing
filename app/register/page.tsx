import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader } from "@/app/components/ui";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Create account",
  robots: { index: false },
};

export default function RegisterPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contributor area"
        title="Create account"
        intro="New contributors start with reading access. An administrator grants writer or editor permissions once you're registered."
      />
      <Container className="pb-24">
        <div className="max-w-md space-y-8 border border-hairline bg-surface p-8">
          <RegisterForm />
          <p className="text-sm text-muted">
            Already have an account?{" "}
            <Link href="/signin" className="text-ink underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </Container>
    </>
  );
}
