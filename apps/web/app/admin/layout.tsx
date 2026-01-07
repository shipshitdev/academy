"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const ADMIN_EMAIL = "vincent@genfeed.ai";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();

  // Wait for user to load
  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Check if user is admin
  const isAdmin = user?.emailAddresses?.some(
    (email) => email.emailAddress === ADMIN_EMAIL
  );

  if (!isAdmin) {
    redirect("/");
  }

  return <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>;
}
