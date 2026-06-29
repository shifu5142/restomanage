import { ReviewsView } from "@/components/reviews/reviews-view";
import { mockData } from "@/data/mock";

function ReviewsPage() {
  return <ReviewsView reviews={mockData.reviews} />;
}
export default ReviewsPage;
