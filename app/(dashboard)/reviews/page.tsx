import { ReviewsView } from "@/components/reviews/reviews-view";
import { mockData } from "@/data/mock";

export default function ReviewsPage() {
  return <ReviewsView reviews={mockData.reviews} />;
}
