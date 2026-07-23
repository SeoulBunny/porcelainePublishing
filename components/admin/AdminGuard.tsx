"use client";

// Gates the admin mockup behind the specialized admin login. There's no real
// backend/session (see brief.md), so this is a client-side check against the
// same localStorage-backed mock auth the rest of the site uses — it stops
// casual navigation to /admin, not a determined visitor, but that matches
// the "UI mockup only" scope of the admin surface itself.

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMockAuth } from "@/lib/auth/mock-auth";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isHydrated } = useMockAuth();
  const router = useRouter();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (isHydrated && !isAdmin) {
      router.replace("/admin/login");
    }
  }, [isHydrated, isAdmin, router]);

  if (!isHydrated || !isAdmin) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center bg-porcelain">
        <p className="text-sm text-slate">Checking admin access…</p>
      </div>
    );
  }

  return <>{children}</>;
}
