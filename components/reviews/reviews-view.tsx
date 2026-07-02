"use client";

import { useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatRelative } from "@/lib/format";
import type { Review } from "@/types";

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

interface ReviewsViewProps {
  reviews: Review[];
}

export function ReviewsView({ reviews }: ReviewsViewProps) {
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;
  const fiveStars = reviews.filter((r) => r.rating === 5).length;

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
          reviews.slice(0, 20).map((review) => (
          <Card key={review.id} className="border-white/10 bg-card/60 backdrop-blur-xl">
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={review.avatar} alt={review.customerName} />
                  <AvatarFallback>{review.customerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{review.customerName}</p>
                      <p className="text-xs text-muted-foreground">{formatRelative(review.date)}</p>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="mt-2 text-sm">{review.comment}</p>
                  {review.dish && (
                    <p className="mt-1 text-xs text-orange-500">Ordered: {review.dish}</p>
                  )}
                </div>
              </div>

              {review.photos && review.photos.length > 0 && (
                <div className="flex gap-2">
                  {review.photos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt="Review photo"
                      className="size-20 rounded-xl object-cover"
                    />
                  ))}
                </div>
              )}

              {review.reply && !replyingTo && (
                <div className="rounded-xl border border-white/10 bg-background/40 p-3">
                  <p className="text-xs font-medium text-orange-500">Your Reply</p>
                  <p className="mt-1 text-sm text-muted-foreground">{review.reply}</p>
                </div>
              )}

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
              ) : !review.reply && (
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
        ))
        )}
      </div>
    </div>
  );
}
