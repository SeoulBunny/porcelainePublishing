import type { Metadata } from "next";
import { googleEnabled } from "@/lib/auth";
import { Container, PageHeader } from "@/app/components/ui";
import { SignInForm } from "./signin-form";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const redirectTo = callbackUrl && callbackUrl.startsWith("/admin") ? callbackUrl : "/admin";

  return (
    <>
      <PageHeader
        eyebrow="Contributor area"
        title="Sign in"
        intro="For writers, editors, and administrators. Readers can browse the whole site without signing in."
      />
      <Container className="pb-24">
        <SignInForm googleEnabled={googleEnabled} redirectTo={redirectTo} />
      </Container>
    </>
  );
}
