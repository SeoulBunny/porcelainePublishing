import type { Metadata } from "next";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";
import { AdminDashboardOverview } from "@/components/admin/AdminDashboardOverview";
import { AdminActivityLog } from "@/components/admin/AdminActivityLog";
import { AdminQuickActions } from "@/components/admin/AdminQuickActions";
import { AdminContentPanels } from "@/components/admin/AdminContentPanels";

export const metadata: Metadata = {
  title: "Admin",
  description: "Porcelain Publishing admin interface (UI mockup, no functional backend).",
  robots: { index: false, follow: false },
  alternates: { canonical: "/admin" },
};

export default function AdminPage() {
  return (
    <AdminGuard>
      <div className="flex flex-col bg-porcelain lg:flex-row">
        <AdminSidebarNav />
        <div className="min-w-0 flex-1">
          <AdminDashboardOverview />
          <AdminActivityLog />
          <AdminQuickActions />
          <AdminContentPanels />
        </div>
      </div>
    </AdminGuard>
  );
}
