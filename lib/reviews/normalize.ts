import type { Review } from "@/types";

export type SupabaseReviewRow = {
  id: string;
  user_id?: string;
  number_star: number;
  your_review: string;
  dish?: string | null;
  created_at?: string;
};

export function supabaseReviewToAdminReview(row: SupabaseReviewRow): Review {
  return {
    id: row.id,
    customerId: row.user_id ?? "",
    customerName: row.user_id ? `User #${row.user_id.slice(0, 8).toUpperCase()}` : "Guest",
    avatar: "",
    rating: row.number_star,
    comment: row.your_review,
    dish: row.dish ?? undefined,
    date: row.created_at ?? new Date().toISOString(),
  };
}

export function supabaseReviewsToAdminReviews(rows: SupabaseReviewRow[]): Review[] {
  return rows.map(supabaseReviewToAdminReview);
}
