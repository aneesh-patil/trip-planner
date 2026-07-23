import { describe, it, expect, vi, beforeEach } from "vitest";
import { SupabaseTripRepository } from "../TripRepository";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase", () => {
  const mockFrom = vi.fn();
  return {
    supabase: {
      from: mockFrom,
    },
  };
});

describe("TripRepository Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls select when fetching user trips", async () => {
    const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });
    const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

    vi.mocked(supabase!.from).mockReturnValue({ select: mockSelect } as any);

    const repo = new SupabaseTripRepository();
    const trips = await repo.fetchTrips("user-1");

    expect(supabase!.from).toHaveBeenCalledWith("trips");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockEq).toHaveBeenCalledWith("user_id", "user-1");
    expect(trips).toEqual([]);
  });
});
