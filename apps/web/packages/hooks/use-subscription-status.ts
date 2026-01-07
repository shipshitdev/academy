"use client";

import { useAuth } from "@clerk/nextjs";
import type { Subscription } from "@interfaces/subscription.interface";
import type { ISubscriptionStatus } from "@interfaces/subscription-status.interface";
import { SubscriptionService } from "@services/subscription.service";
import { useEffect, useState } from "react";

export function useSubscriptionStatus(): ISubscriptionStatus {
  const { isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    if (!isSignedIn) {
      setSubscriptions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    SubscriptionService.getMine()
      .then(setSubscriptions)
      .catch(() => setSubscriptions([]))
      .finally(() => setIsLoading(false));
  }, [isSignedIn]);

  const isActive = subscriptions.some((subscription) => subscription.status === "active");

  return { isLoading, isActive };
}
