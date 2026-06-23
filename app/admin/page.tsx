import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/guards";

// Route signed-in users to the right home for their role.
export default async function AdminHome() {
  const user = await requireUser();
  if (user.role === "admin") redirect("/admin/manage/users");
  if (user.role === "editor") redirect("/admin/editor");
  if (user.role === "writer") redirect("/admin/writer");
  redirect("/"); // readers have no contributor area
}
