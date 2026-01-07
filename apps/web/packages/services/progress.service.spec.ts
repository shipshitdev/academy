import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProgressService } from "./progress.service";

const API_URL = "http://localhost:3001";

describe("ProgressService", () => {
  const mockToken = "mock-token";
  const mockProgress = {
    id: "progress-1",
    lessonId: "lesson-1",
    userId: "user-1",
    completedAt: "2024-01-05T14:30:00Z",
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

  describe("upsert", () => {
    it("should upsert progress without completedAt", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockProgress),
      } as Response);

      const result = await ProgressService.upsert("lesson-1");

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify({ lessonId: "lesson-1", completedAt: undefined }),
      });
      expect(result).toEqual(mockProgress);
    });

    it("should upsert progress with completedAt", async () => {
      const completedAt = "2024-01-05T14:30:00Z";
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockProgress),
      } as Response);

      const result = await ProgressService.upsert("lesson-1", completedAt);

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify({ lessonId: "lesson-1", completedAt }),
      });
      expect(result).toEqual(mockProgress);
    });

    it("should throw error when upsert fails", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: "Invalid lesson" }),
      } as Response);

      await expect(ProgressService.upsert("lesson-1")).rejects.toThrow("Invalid lesson");
    });
  });

  describe("getMine", () => {
    it("should fetch user progress", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([mockProgress]),
      } as Response);

      const result = await ProgressService.getMine();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/progress/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        signal: undefined,
      });
      expect(result).toEqual([mockProgress]);
    });

    it("should pass abort signal when provided", async () => {
      const controller = new AbortController();
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response);

      await ProgressService.getMine({ signal: controller.signal });

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/progress/me`, {
        headers: expect.any(Object),
        signal: controller.signal,
      });
    });
  });

  describe("delete", () => {
    it("should delete progress", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
      } as Response);

      await ProgressService.delete("progress-1");

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/progress/progress-1`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
      });
    });

    it("should throw error on failed delete", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: "Progress not found" }),
      } as Response);

      await expect(ProgressService.delete("progress-1")).rejects.toThrow("Progress not found");
    });

    it("should throw generic error when json parsing fails", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        json: () => Promise.reject(new Error("Parse error")),
      } as Response);

      await expect(ProgressService.delete("progress-1")).rejects.toThrow("Delete failed");
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

      await ProgressService.getMine();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/progress/me`, {
        headers: {
          "Content-Type": "application/json",
        },
        signal: undefined,
      });
    });
  });
});
