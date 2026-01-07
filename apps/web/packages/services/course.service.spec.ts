import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { CourseService } from "./course.service";

const API_URL = "http://localhost:3001";

describe("CourseService", () => {
  const mockToken = "mock-token";
  const mockCourse = {
    id: "course-1",
    title: "Test Course",
    slug: "test-course",
    description: "A test course",
    communityId: "community-1",
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
    it("should fetch all courses without communityId", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([mockCourse]),
      } as Response);

      const result = await CourseService.getAll();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/courses`, {
        headers: expect.any(Object),
        signal: undefined,
      });
      expect(result).toEqual([mockCourse]);
    });

    it("should fetch courses with communityId filter", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([mockCourse]),
      } as Response);

      const result = await CourseService.getAll("community-1");

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/courses?communityId=community-1`, {
        headers: expect.any(Object),
        signal: undefined,
      });
      expect(result).toEqual([mockCourse]);
    });

    it("should pass abort signal when provided", async () => {
      const controller = new AbortController();
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response);

      await CourseService.getAll(undefined, { signal: controller.signal });

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/courses`, {
        headers: expect.any(Object),
        signal: controller.signal,
      });
    });
  });

  describe("getBySlug", () => {
    it("should fetch course by slug", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCourse),
      } as Response);

      const result = await CourseService.getBySlug("test-course");

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/courses/slug/test-course`, {
        headers: expect.any(Object),
        signal: undefined,
      });
      expect(result).toEqual(mockCourse);
    });
  });

  describe("getAdminAll", () => {
    it("should fetch all courses for admin without filter", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([mockCourse]),
      } as Response);

      const result = await CourseService.getAdminAll();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/courses/admin`, {
        headers: expect.any(Object),
        signal: undefined,
      });
      expect(result).toEqual([mockCourse]);
    });

    it("should fetch courses for admin with communityId filter", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([mockCourse]),
      } as Response);

      const result = await CourseService.getAdminAll("community-1");

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/courses/admin?communityId=community-1`, {
        headers: expect.any(Object),
        signal: undefined,
      });
      expect(result).toEqual([mockCourse]);
    });
  });

  describe("getAdminById", () => {
    it("should fetch course by id for admin", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCourse),
      } as Response);

      const result = await CourseService.getAdminById("course-1");

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/courses/admin/course-1`, {
        headers: expect.any(Object),
        signal: undefined,
      });
      expect(result).toEqual(mockCourse);
    });
  });

  describe("create", () => {
    it("should create a course", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCourse),
      } as Response);

      const data = { title: "Test Course", slug: "test-course", communityId: "community-1" };
      const result = await CourseService.create(data);

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify(data),
      });
      expect(result).toEqual(mockCourse);
    });
  });

  describe("update", () => {
    it("should update a course", async () => {
      const updatedCourse = { ...mockCourse, title: "Updated Course" };
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(updatedCourse),
      } as Response);

      const data = { title: "Updated Course" };
      const result = await CourseService.update("course-1", data);

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/courses/course-1`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify(data),
      });
      expect(result).toEqual(updatedCourse);
    });
  });

  describe("delete", () => {
    it("should delete a course", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
      } as Response);

      await CourseService.delete("course-1");

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/courses/course-1`, {
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
        json: () => Promise.resolve({ message: "Course has lessons" }),
      } as Response);

      await expect(CourseService.delete("course-1")).rejects.toThrow("Course has lessons");
    });

    it("should throw generic error when json parsing fails", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        json: () => Promise.reject(new Error("Parse error")),
      } as Response);

      await expect(CourseService.delete("course-1")).rejects.toThrow("Delete failed");
    });
  });
});
