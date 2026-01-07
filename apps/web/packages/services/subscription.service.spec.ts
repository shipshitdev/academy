import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SubscriptionService } from "./subscription.service";

const API_URL = "http://localhost:3001";

describe("SubscriptionService", () => {
  const mockToken = "mock-token";
  const mockSubscription = {
    id: "subscription-1",
    userId: "user-1",
    status: "active",
    planId: "plan-1",
    currentPeriodStart: "2024-01-01T00:00:00Z",
    currentPeriodEnd: "2024-02-01T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
  };

  beforeEach(() => {
    vi.stubGlobal("window", {
      Clerk: {
        session: {
          getToken: vi.fn().mockResolvedValue(mockToken),
        },
      },
    });
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("getMine", () => {
    it("should fetch user subscriptions", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([mockSubscription]),
      } as Response);

      const result = await SubscriptionService.getMine();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/subscriptions/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        signal: undefined,
      });
      expect(result).toEqual([mockSubscription]);
    });

    it("should pass abort signal when provided", async () => {
      const controller = new AbortController();
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response);

      await SubscriptionService.getMine({ signal: controller.signal });

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/subscriptions/me`, {
        headers: expect.any(Object),
        signal: controller.signal,
      });
    });

    it("should throw error when fetch fails", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: "Unauthorized" }),
      } as Response);

      await expect(SubscriptionService.getMine()).rejects.toThrow("Unauthorized");
    });
  });

  describe("createCheckout", () => {
    it("should create checkout session", async () => {
      const checkoutResponse = { url: "https://checkout.stripe.com/session123" };
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(checkoutResponse),
      } as Response);

      const result = await SubscriptionService.createCheckout();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/billing/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
      });
      expect(result).toEqual(checkoutResponse);
    });

    it("should throw error when checkout creation fails", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: "Invalid request" }),
      } as Response);

      await expect(SubscriptionService.createCheckout()).rejects.toThrow("Invalid request");
    });
  });

  describe("cancel", () => {
    it("should cancel subscription", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
      } as Response);

      await SubscriptionService.cancel("subscription-1");

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/subscriptions/subscription-1/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
      });
    });

    it("should throw error on failed cancel", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: "Subscription not found" }),
      } as Response);

      await expect(SubscriptionService.cancel("subscription-1")).rejects.toThrow("Subscription not found");
    });

    it("should throw generic error when json parsing fails", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        json: () => Promise.reject(new Error("Parse error")),
      } as Response);

      await expect(SubscriptionService.cancel("subscription-1")).rejects.toThrow("Cancel failed");
    });
  });

  describe("auth headers", () => {
    it("should work without auth token", async () => {
      vi.stubGlobal("window", {
        Clerk: {
          session: {
            getToken: vi.fn().mockResolvedValue(null),
          },
        },
      });

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response);

      await SubscriptionService.getMine();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/subscriptions/me`, {
        headers: {
          "Content-Type": "application/json",
        },
        signal: undefined,
      });
    });
  });

  describe("error handling", () => {
    it("should throw HTTP status error when no message", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      } as Response);

      await expect(SubscriptionService.getMine()).rejects.toThrow("HTTP 500");
    });

    it("should handle json parse failure gracefully", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error("Parse error")),
      } as Response);

      await expect(SubscriptionService.getMine()).rejects.toThrow("Request failed");
    });
  });
});
