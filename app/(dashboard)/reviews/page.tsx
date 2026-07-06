"use client";

import { useEffect, useState } from "react";
import { RolePage } from "@/components/auth/role-page";
import { CustomerReviews } from "@/components/customer/customer-reviews";
import { ReviewsView } from "@/components/reviews/reviews-view";
import { PageLoading } from "@/components/ui/page-loading";
import { type SupabaseReviewRow } from "@/lib/reviews/normalize";
import { supabase } from "@/lib/supabase/client";

function ReviewsPage() {
  const [reviews, setReviews] = useState<SupabaseReviewRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getReviews() {
      const { data, error } = await supabase.from("reviews").select("*");
      if (error) {
        console.error(error);
        setReviews([]);
        setLoading(false);
        return;
      }
      setReviews(data ?? []);
      setLoading(false);
    }
    getReviews();
  }, []);

  if (loading) {
    return <PageLoading message="Loading reviews..." />;
  }

  return (
    <RolePage
      admin={<ReviewsView />}
      customer={<CustomerReviews />}
    />
  );
}
export default ReviewsPage;
