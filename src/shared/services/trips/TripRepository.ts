import { supabase } from "@/lib/supabase";
import type { Trip } from "@/shared/types/trip";

export interface ITripRepository {
  fetchTrips(userId: string): Promise<Trip[]>;
  saveTrip(trip: Trip): Promise<void>;
  deleteTrip(tripId: string): Promise<void>;
}

export class SupabaseTripRepository implements ITripRepository {
  async fetchTrips(userId: string): Promise<Trip[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to fetch trips from database", error);
      throw error;
    }

    return (data || []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      startDate: row.start_date || undefined,
      endDate: row.end_date || undefined,
      status: row.status,
      stops: row.stops || [],
      journalNotes: row.journal_notes || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async saveTrip(trip: Trip): Promise<void> {
    if (!supabase) return;
    const payload = {
      id: trip.id,
      user_id: trip.userId,
      title: trip.title,
      start_date: trip.startDate || null,
      end_date: trip.endDate || null,
      status: trip.status,
      stops: trip.stops,
      journal_notes: trip.journalNotes || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("trips").upsert(payload);
    if (error) {
      console.error("Failed to upsert trip in database", error);
      throw error;
    }
  }

  async deleteTrip(tripId: string): Promise<void> {
    if (!supabase) return;
    const { error } = await supabase.from("trips").delete().eq("id", tripId);
    if (error) {
      console.error("Failed to delete trip from database", error);
      throw error;
    }
  }
}
