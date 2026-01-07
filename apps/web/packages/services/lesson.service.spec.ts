import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { LessonService } from "./lesson.service";

const API_URL = "http://localhost:3001";

describe("LessonService", () => {
  const mockToken = "mock-token";
  const mockLesson = {
    id: "lesson-1",
    title: "Test Lesson",
    slug: "test-lesson",
    content: "Lesson content here",
    courseId: "course-1",
    order: 1,
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

  describe("getAll", () => {
    it("should fetch all lessons for a course", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([mockLesson]),
      } as Response);

      const result = await LessonService.getAll("course-1");

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/lessons?courseId=course-1`, {
        headers: expect.any(Object),
        signal: undefined,
      });
      expect(result).toEqual([mockLesson]);
    });

    it("should pass abort signal when provided", async () => {
      const controller = new AbortController();
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response);

      await LessonService.getAll("course-1", { signal: controller.signal });

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/lessons?courseId=course-1`, {
        headers: expect.any(Object),
        signal: controller.signal,
      });
    });
  });

  describe("getBySlug", () => {
    it("should fetch lesson by slug", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockLesson),
      } as Response);

      const result = await LessonService.getBySlug("test-lesson");

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/lessons/slug/test-lesson`, {
        headers: expect.any(Object),
        signal: undefined,
      });
      expect(result).toEqual(mockLesson);
    });
  });

  describe("getAdminAll", () => {
    it("should fetch all lessons for admin without filter", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([mockLesson]),
      } as Response);

      const result = await LessonService.getAdminAll();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/lessons/admin`, {
        headers: expect.any(Object),
        signal: undefined,
      });
      expect(result).toEqual([mockLesson]);
    });

    it("should fetch lessons for admin with courseId filter", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([mockLesson]),
      } as Response);

      const result = await LessonService.getAdminAll("course-1");

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/lessons/admin?courseId=course-1`, {
        headers: expect.any(Object),
        signal: undefined,
      });
      expect(result).toEqual([mockLesson]);
    });
  });

  describe("getAdminById", () => {
    it("should fetch lesson by id for admin", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockLesson),
      } as Response);

      const result = await LessonService.getAdminById("lesson-1");

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/lessons/admin/lesson-1`, {
        headers: expect.any(Object),
        signal: undefined,
      });
      expect(result).toEqual(mockLesson);
    });
  });

  describe("create", () => {
    it("should create a lesson", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockLesson),
      } as Response);

      const data = { title: "Test Lesson", slug: "test-lesson", courseId: "course-1" };
      const result = await LessonService.create(data);

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/lessons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify(data),
      });
      expect(result).toEqual(mockLesson);
    });
  });

  describe("update", () => {
    it("should update a lesson", async () => {
      const updatedLesson = { ...mockLesson, title: "Updated Lesson" };
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(updatedLesson),
      } as Response);

      const data = { title: "Updated Lesson" };
      const result = await LessonService.update("lesson-1", data);

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/lessons/lesson-1`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify(data),
      });
      expect(result).toEqual(updatedLesson);
    });
  });

  describe("delete", () => {
    it("should delete a lesson", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
      } as Response);

      await LessonService.delete("lesson-1");

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/lessons/lesson-1`, {
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
        json: () => Promise.resolve({ message: "Lesson not found" }),
      } as Response);

      await expect(LessonService.delete("lesson-1")).rejects.toThrow("Lesson not found");
    });

    it("should throw generic error when json parsing fails", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        json: () => Promise.reject(new Error("Parse error")),
      } as Response);

      await expect(LessonService.delete("lesson-1")).rejects.toThrow("Delete failed");
    });
  });

  describe("error handling", () => {
    it("should throw error with message from response", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: "Not found" }),
      } as Response);

      await expect(LessonService.getBySlug("unknown")).rejects.toThrow("Not found");
    });

    it("should throw HTTP status error when no message", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      } as Response);

      await expect(LessonService.getAll("course-1")).rejects.toThrow("HTTP 500");
    });
  });
});
