import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { EventService } from "./event.service";

const API_URL = "http://localhost:3001";

describe("EventService", () => {
  const mockToken = "mock-token";
  const mockEvent = {
    id: "event-1",
    title: "Test Event",
    description: "A test event",
    startDate: "2024-01-15T10:00:00Z",
    endDate: "2024-01-15T12:00:00Z",
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
    it("should fetch all events", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([mockEvent]),
      } as Response);

      const result = await EventService.getAll();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/events`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        signal: undefined,
      });
      expect(result).toEqual([mockEvent]);
    });

    it("should pass abort signal when provided", async () => {
      const controller = new AbortController();
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response);

      await EventService.getAll({ signal: controller.signal });

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/events`, {
        headers: expect.any(Object),
        signal: controller.signal,
      });
    });
  });

  describe("getAdminAll", () => {
    it("should fetch all events for admin", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([mockEvent]),
      } as Response);

      const result = await EventService.getAdminAll();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/events/admin`, {
        headers: expect.any(Object),
        signal: undefined,
      });
      expect(result).toEqual([mockEvent]);
    });
  });

  describe("getAdminById", () => {
    it("should fetch event by id for admin", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockEvent),
      } as Response);

      const result = await EventService.getAdminById("event-1");

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/events/admin/event-1`, {
        headers: expect.any(Object),
        signal: undefined,
      });
      expect(result).toEqual(mockEvent);
    });
  });

  describe("create", () => {
    it("should create an event", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockEvent),
      } as Response);

      const data = {
        title: "Test Event",
        startDate: "2024-01-15T10:00:00Z",
        endDate: "2024-01-15T12:00:00Z",
      };
      const result = await EventService.create(data);

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify(data),
      });
      expect(result).toEqual(mockEvent);
    });
  });

  describe("update", () => {
    it("should update an event", async () => {
      const updatedEvent = { ...mockEvent, title: "Updated Event" };
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(updatedEvent),
      } as Response);

      const data = { title: "Updated Event" };
      const result = await EventService.update("event-1", data);

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/events/event-1`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify(data),
      });
      expect(result).toEqual(updatedEvent);
    });
  });

  describe("delete", () => {
    it("should delete an event", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
      } as Response);

      await EventService.delete("event-1");

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/events/event-1`, {
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
        json: () => Promise.resolve({ message: "Event not found" }),
      } as Response);

      await expect(EventService.delete("event-1")).rejects.toThrow("Event not found");
    });

    it("should throw generic error when json parsing fails", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        json: () => Promise.reject(new Error("Parse error")),
      } as Response);

      await expect(EventService.delete("event-1")).rejects.toThrow("Delete failed");
    });
  });

  describe("error handling", () => {
    it("should throw error with message from response", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: "Unauthorized" }),
      } as Response);

      await expect(EventService.getAll()).rejects.toThrow("Unauthorized");
    });

    it("should throw HTTP status error when no message", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 403,
        json: () => Promise.resolve({}),
      } as Response);

      await expect(EventService.getAll()).rejects.toThrow("HTTP 403");
    });
  });
});
