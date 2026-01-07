import type { IBillingCheckoutResponse } from "@interfaces/billing.interface";
import type { IRequestOptions } from "@interfaces/request-options.interface";
import type { Subscription } from "@interfaces/subscription.interface";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await window.Clerk?.session?.getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
}

export const SubscriptionService = {
  async getMine(options?: IRequestOptions): Promise<Subscription[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/subscriptions/me`, {
      headers,
      signal: options?.signal,
    });
    return handleResponse<Subscription[]>(response);
  },

  async createCheckout(): Promise<IBillingCheckoutResponse> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/billing/checkout`, {
      method: "POST",
      headers,
    });
    return handleResponse<IBillingCheckoutResponse>(response);
  },

  async cancel(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/subscriptions/${id}/cancel`, {
      method: "POST",
      headers,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Cancel failed" }));
      throw new Error(error.message);
    }
  },

  async createPortalSession(): Promise<IBillingCheckoutResponse> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/billing/portal`, {
      method: "POST",
      headers,
    });
    return handleResponse<IBillingCheckoutResponse>(response);
  },
};
