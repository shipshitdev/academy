import type { Progress } from "@interfaces/progress.interface";
import type { IRequestOptions } from "@interfaces/request-options.interface";

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

export const ProgressService = {
  async upsert(lessonId: string, completedAt?: string): Promise<Progress> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/progress`, {
      method: "POST",
      headers,
      body: JSON.stringify({ lessonId, completedAt }),
    });
    return handleResponse<Progress>(response);
  },

  async getMine(options?: IRequestOptions): Promise<Progress[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/progress/me`, {
      headers,
      signal: options?.signal,
    });
    return handleResponse<Progress[]>(response);
  },

  async delete(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/progress/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Delete failed" }));
      throw new Error(error.message);
    }
  },
};
