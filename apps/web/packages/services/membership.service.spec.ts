import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MembershipService } from "./membership.service";

const API_URL = "http://localhost:3001";

describe("MembershipService", () => {
  const mockToken = "mock-token";
  const mockMembership = {
    id: "membership-1",
    communityId: "community-1",
    userId: "user-1",
    role: "member",
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

  describe("join", () => {
    it("should join a community", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockMembership),
      } as Response);

      const result = await MembershipService.join("community-1");

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/memberships`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify({ communityId: "community-1" }),
      });
      expect(result).toEqual(mockMembership);
    });

    it("should throw error when join fails", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: "Already a member" }),
      } as Response);

      await expect(MembershipService.join("community-1")).rejects.toThrow("Already a member");
    });
  });

  describe("getMine", () => {
    it("should fetch user memberships", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([mockMembership]),
      } as Response);

      const result = await MembershipService.getMine();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/memberships/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        signal: undefined,
      });
      expect(result).toEqual([mockMembership]);
    });

    it("should pass abort signal when provided", async () => {
      const controller = new AbortController();
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response);

      await MembershipService.getMine({ signal: controller.signal });

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/memberships/me`, {
        headers: expect.any(Object),
        signal: controller.signal,
      });
    });
  });

  describe("delete", () => {
    it("should delete a membership", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
      } as Response);

      await MembershipService.delete("membership-1");

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/memberships/membership-1`, {
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
        json: () => Promise.resolve({ message: "Membership not found" }),
      } as Response);

      await expect(MembershipService.delete("membership-1")).rejects.toThrow("Membership not found");
    });

    it("should throw generic error when json parsing fails", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        json: () => Promise.reject(new Error("Parse error")),
      } as Response);

      await expect(MembershipService.delete("membership-1")).rejects.toThrow("Delete failed");
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

      await MembershipService.getMine();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/memberships/me`, {
        headers: {
          "Content-Type": "application/json",
        },
        signal: undefined,
      });
    });
  });
});
