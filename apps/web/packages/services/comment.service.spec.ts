import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { CommentService } from "./comment.service";

const API_URL = "http://localhost:3001";

describe("CommentService", () => {
  const mockToken = "mock-token";
  const mockComment = {
    id: "comment-1",
    content: "Test comment",
    lessonId: "lesson-1",
    userId: "user-1",
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

  describe("getByLessonId", () => {
    it("should fetch comments for a lesson", async () => {
      const mockComments = [mockComment];
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockComments),
      } as Response);

      const result = await CommentService.getByLessonId("lesson-1");

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/comments?lessonId=lesson-1`);
      expect(result).toEqual(mockComments);
    });

    it("should throw error on failed request", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: "Server error" }),
      } as Response);

      await expect(CommentService.getByLessonId("lesson-1")).rejects.toThrow("Server error");
    });

    it("should throw generic error when json parsing fails", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error("Parse error")),
      } as Response);

      await expect(CommentService.getByLessonId("lesson-1")).rejects.toThrow("Request failed");
    });
  });

  describe("create", () => {
    it("should create a comment with auth headers", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockComment),
      } as Response);

      const payload = { lessonId: "lesson-1", content: "Test comment" };
      const result = await CommentService.create(payload);

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify(payload),
      });
      expect(result).toEqual(mockComment);
    });

    it("should create comment without auth token when not available", async () => {
      vi.stubGlobal("window", {
        Clerk: {
          session: {
            getToken: vi.fn().mockResolvedValue(null),
          },
        },
      });

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockComment),
      } as Response);

      const payload = { lessonId: "lesson-1", content: "Test comment" };
      await CommentService.create(payload);

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    });
  });

  describe("delete", () => {
    it("should delete a comment", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
      } as Response);

      await CommentService.delete("comment-1");

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/comments/comment-1`, {
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
        status: 404,
        json: () => Promise.resolve({ message: "Comment not found" }),
      } as Response);

      await expect(CommentService.delete("comment-1")).rejects.toThrow("Comment not found");
    });

    it("should throw generic error when json parsing fails on delete", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error("Parse error")),
      } as Response);

      await expect(CommentService.delete("comment-1")).rejects.toThrow("Failed to delete comment");
    });
  });
});
