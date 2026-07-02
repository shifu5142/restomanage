"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Star, Trash2 } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockData } from "@/data/mock";
import { useRole } from "@/hooks/use-role";
import { formatRelative } from "@/lib/format";
import { supabase } from "@/lib/supabase/client";

type PrevReview = {
  id: string;
  number_star: number;
  your_review: string;
  dish?: string | null;
  created_at?: string;
};

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
  const displayName = display?.name ?? "You";
  const [prevReviews, setPrevReviews] = useState<PrevReview[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [dish, setDish] = useState("");
  const [reviewToDelete, setReviewToDelete] = useState<PrevReview | null>(null);

  const dishOptions = useMemo(
    () => mockData.menuItems.filter((m) => m.available).slice(0, 20),
    []
  );
  
  useEffect(() => {
    async function getReviews() {
      const{data:{user:{id}},error:getUserError} = await supabase.auth.getUser();
      const {data,error} = await supabase.from("reviews").select("*").eq("user_id", id);
      if (error) {
        toast.error(error.message);
        return;
      }
      setPrevReviews(data);
    }
    getReviews();
  }, []);
  async function handleSubmit(e: React.FormEvent) {
    const{data:{user:{id}},error:getUserError} = await supabase.auth.getUser();
    e.preventDefault();
    try {
    if (!comment.trim()) {
      toast.error("Please write a comment for your review.");
      return;
    }
   
    if (getUserError) {
      toast.error(getUserError.message);
      return;
    }
    const {error} = await supabase.from("reviews").insert({
      user_id: id,
      number_star: rating,   // 1–5
      dish: dish || null,   // optional
      your_review: comment,    // required
    }).select().single();

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Thank you for your review!", {
      description: "Your feedback helps us improve.",
    });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unknown error occurred");
    }
  }

  async function handleDeleteReview() {
    setReviewToDelete(null);
    const {error} = await supabase.from("reviews").delete().eq("id", reviewToDelete?.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Review deleted successfully");
    setPrevReviews(prevReviews.filter((review) => review.id !== reviewToDelete?.id));
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
          <h2 className="text-lg font-semibold">Your Previous Reviews</h2>
          {prevReviews.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No reviews yet"
              description="Share your first dining experience using the form."
            />
          ) : (
            prevReviews.map((review) => (
              <Card key={review.id} className="border-white/10 bg-card/60 backdrop-blur-xl">
                <CardContent className="space-y-3 pt-6">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-orange-500/15 text-orange-600">
                        {displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold">{displayName}</p>
                        <StarRating rating={review.number_star} />
                      </div>
                      {review.created_at && (
                        <p className="text-xs text-muted-foreground">
                          {formatRelative(review.created_at)}
                        </p>
                      )}
                      <p className="mt-2 text-sm leading-relaxed">{review.your_review}</p>
                      {review.dish && (
                        <p className="mt-2 text-xs font-medium text-orange-500">
                          Dish: {review.dish}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 cursor-pointer text-muted-foreground hover:text-destructive"
                      aria-label="Delete review"
                      onClick={() => setReviewToDelete(review)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Dialog
        open={!!reviewToDelete}
        onOpenChange={(open) => !open && setReviewToDelete(null)}
      >
        <DialogContent
          className="border-white/10 bg-card/95 backdrop-blur-xl sm:max-w-md"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle>Delete review?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => setReviewToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteReview}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
