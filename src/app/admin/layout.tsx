import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import { isStaffRole } from "@/lib/authz";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/auth/adminlogin");
  }

  if (!isStaffRole(session.user.role)) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
