/**
 * @vitest-environment jsdom
 */

import { SubscriptionService } from "@services/subscription.service";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSubscriptionStatus } from "./use-subscription-status";

// Mock dependencies
vi.mock("@clerk/nextjs", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@services/subscription.service", () => ({
  SubscriptionService: {
    getMine: vi.fn(),
  },
}));

import { useAuth } from "@clerk/nextjs";

describe("useSubscriptionStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should return not loading and not active when not signed in", async () => {
    vi.mocked(useAuth).mockReturnValue({ isSignedIn: false } as ReturnType<typeof useAuth>);

    const { result } = renderHook(() => useSubscriptionStatus());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isActive).toBe(false);
    });
  });

  it("should fetch subscriptions when signed in", async () => {
    vi.mocked(useAuth).mockReturnValue({ isSignedIn: true } as ReturnType<typeof useAuth>);
    vi.mocked(SubscriptionService.getMine).mockResolvedValue([
      { id: "sub-1", status: "active", userId: "user-1" } as never,
    ]);

    const { result } = renderHook(() => useSubscriptionStatus());

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isActive).toBe(true);
    });

    expect(SubscriptionService.getMine).toHaveBeenCalled();
  });

  it("should return isActive false when no active subscriptions", async () => {
    vi.mocked(useAuth).mockReturnValue({ isSignedIn: true } as ReturnType<typeof useAuth>);
    vi.mocked(SubscriptionService.getMine).mockResolvedValue([
      { id: "sub-1", status: "canceled", userId: "user-1" } as never,
    ]);

    const { result } = renderHook(() => useSubscriptionStatus());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isActive).toBe(false);
    });
  });

  it("should return isActive true when at least one active subscription", async () => {
    vi.mocked(useAuth).mockReturnValue({ isSignedIn: true } as ReturnType<typeof useAuth>);
    vi.mocked(SubscriptionService.getMine).mockResolvedValue([
      { id: "sub-1", status: "canceled", userId: "user-1" } as never,
      { id: "sub-2", status: "active", userId: "user-1" } as never,
    ]);

    const { result } = renderHook(() => useSubscriptionStatus());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isActive).toBe(true);
    });
  });

  it("should handle fetch error gracefully", async () => {
    vi.mocked(useAuth).mockReturnValue({ isSignedIn: true } as ReturnType<typeof useAuth>);
    vi.mocked(SubscriptionService.getMine).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useSubscriptionStatus());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isActive).toBe(false);
    });
  });

  it("should return isActive false with empty subscriptions array", async () => {
    vi.mocked(useAuth).mockReturnValue({ isSignedIn: true } as ReturnType<typeof useAuth>);
    vi.mocked(SubscriptionService.getMine).mockResolvedValue([]);

    const { result } = renderHook(() => useSubscriptionStatus());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isActive).toBe(false);
    });
  });
});
