"use client";

import { useMemo, useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockData } from "@/data/mock";
import { useRole } from "@/hooks/use-role";
import { formatRelative } from "@/lib/format";
import type { Review } from "@/types";

function StarRating({
  rating,
  onChange,
  interactive = false,
}: {
  rating: number;
  onChange?: (rating: number) => void;
  interactive?: boolean;
}) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(i + 1)}
          className={interactive ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default"}
        >
          <Star
            className={`size-5 ${
              i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function CustomerReviews() {
  const { display } = useRole();
  const displayName = display?.name ?? "";

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [dish, setDish] = useState("");
  const [localReviews, setLocalReviews] = useState<Review[]>([]);

  const myReviews = useMemo(() => {
    const fromMock = mockData.reviews.filter(
      (r) => r.customerName.toLowerCase() === displayName.toLowerCase()
    );
    return [...localReviews, ...fromMock].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [displayName, localReviews]);

  const dishOptions = useMemo(
    () => mockData.menuItems.filter((m) => m.available).slice(0, 20),
    []
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please write a comment for your review.");
      return;
    }

    const newReview: Review = {
      id: `rev-custom-${Date.now()}`,
      customerId: "local",
      customerName: displayName || "Guest",
      avatar: display?.avatar ?? "",
      rating,
      comment: comment.trim(),
      dish: dish || undefined,
      date: new Date().toISOString(),
    };

    setLocalReviews((prev) => [newReview, ...prev]);
    setRating(5);
    setComment("");
    setDish("");
    toast.success("Thank you for your review!", {
      description: "Your feedback helps us improve.",
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Reviews"
        description="Share your dining experience and view your past feedback."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10 bg-gradient-to-br from-card/80 to-orange-500/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="size-5 text-orange-500" />
              Leave a Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Rating</Label>
                <StarRating rating={rating} onChange={setRating} interactive />
              </div>
              <div className="space-y-2">
                <Label htmlFor="review-dish">Dish (optional)</Label>
                <Select value={dish} onValueChange={setDish}>
                  <SelectTrigger id="review-dish" className="border-white/10 bg-background/40">
                    <SelectValue placeholder="Select a dish you enjoyed" />
                  </SelectTrigger>
                  <SelectContent>
                    {dishOptions.map((item) => (
                      <SelectItem key={item.id} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="review-comment">Your Review</Label>
                <Textarea
                  id="review-comment"
                  placeholder="Tell us about your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[120px] border-white/10 bg-background/40"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                Submit Review
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Reviews</h2>
          {myReviews.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No reviews yet"
              description="Share your first dining experience using the form."
            />
          ) : (
            myReviews.map((review) => (
              <Card key={review.id} className="border-white/10 bg-card/60 backdrop-blur-xl">
                <CardContent className="space-y-3 pt-6">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={review.avatar} alt={review.customerName} />
                      <AvatarFallback>{review.customerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold">{review.customerName}</p>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="text-xs text-muted-foreground">{formatRelative(review.date)}</p>
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
                          alt="Review"
                          className="size-16 rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
