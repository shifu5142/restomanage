"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Star, UtensilsCrossed } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatRelative } from "@/lib/format";
import {
  type SupabaseReviewRow,
} from "@/lib/reviews/normalize";
import { supabase } from "@/lib/supabase/client";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

export function ReviewsView() {
  const [reviews, setReviews] = useState<SupabaseReviewRow[]>([]);
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    async function getReviews() {
      const { data, error } = await supabase.from("reviews").select("*");
      if (error) {
        console.error(error);
        setReviews([]);
        return;
      }
      setReviews(data ?? []);
    }

    getReviews();
  }, []);

  const avgRating = useMemo(
    () =>
      reviews.length
        ? reviews.reduce((sum, review) => sum + review.number_star, 0) / reviews.length
        : 0,
    [reviews]
  );

  const fiveStars = useMemo(
    () => reviews.filter((review) => review.number_star === 5).length,
    [reviews]
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Reviews" description="Monitor and respond to customer feedback." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Reviews" value={String(reviews.length)} icon={MessageSquare} />
        <StatCard title="Average Rating" value={`${avgRating.toFixed(1)}/5`} change={2.1} icon={Star} />
        <StatCard title="5-Star Reviews" value={String(fiveStars)} icon={Star} />
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card className="border-white/10 bg-card/60 backdrop-blur-xl">
            <CardContent className="py-12 text-center text-muted-foreground">
              No reviews yet.
            </CardContent>
          </Card>
        ) : (
          reviews.slice(0, 20).map((review) => {
            const customerLabel = review.user_id
              ? `User #${review.user_id.slice(0, 8).toUpperCase()}`
              : "Guest";

            return (
          <Card key={review.id} className="border-white/10 bg-card/60 backdrop-blur-xl">
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback>{customerLabel.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{customerLabel}</p>
                      <p className="text-xs text-muted-foreground">
                        {review.created_at ? formatRelative(review.created_at) : "Recently"}
                      </p>
                    </div>
                    <StarRating rating={review.number_star} />
                  </div>
                  <p className="mt-2 text-sm">{review.your_review}</p>
                  {review.dish && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-orange-500">
                      <UtensilsCrossed className="size-3" />
                      {review.dish}
                    </p>
                  )}
                  <Badge variant="outline" className="mt-3 border-white/10 font-mono text-[10px]">
                    {review.id.slice(0, 8)}
                  </Badge>
                </div>
              </div>

              {replyingTo === review.id ? (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Write your reply..."
                    value={replies[review.id] ?? ""}
                    onChange={(e) => setReplies({ ...replies, [review.id]: e.target.value })}
                    className="border-white/10 bg-background/40"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600"
                      onClick={() => setReplyingTo(null)}
                    >
                      Post Reply
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10"
                  onClick={() => setReplyingTo(review.id)}
                >
                  <MessageSquare className="mr-1.5 size-3" />
                  Reply
                </Button>
              )}
            </CardContent>
          </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
