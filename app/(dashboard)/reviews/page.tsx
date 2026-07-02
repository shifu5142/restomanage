"use client";

import { useEffect, useMemo, useState } from "react";
import { RolePage } from "@/components/auth/role-page";
import { CustomerReviews } from "@/components/customer/customer-reviews";
import { ReviewsView } from "@/components/reviews/reviews-view";
import { PageLoading } from "@/components/ui/page-loading";
import {
  supabaseReviewsToAdminReviews,
  type SupabaseReviewRow,
} from "@/lib/reviews/normalize";
import { supabase } from "@/lib/supabase/client";

function ReviewsPage() {
  const [reviews, setReviews] = useState<SupabaseReviewRow[]>([]);
  const [loading, setLoading] = useState(true);

  const adminReviews = useMemo(() => supabaseReviewsToAdminReviews(reviews), [reviews]);

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
      admin={<ReviewsView reviews={adminReviews} />}
      customer={<CustomerReviews />}
    />
  );
}
export default ReviewsPage;
