"use client";

import { useAuth } from "@clerk/nextjs";
import { LandingPage } from "@components/landing/landing-page";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/courses");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || isSignedIn) {
    return null;
  }

  return <LandingPage />;
}
