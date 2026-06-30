import { RolePage } from "@/components/auth/role-page";
import { CustomerReviews } from "@/components/customer/customer-reviews";
import { ReviewsView } from "@/components/reviews/reviews-view";
import { mockData } from "@/data/mock";

function ReviewsPage() {
  return (
    <RolePage
      admin={<ReviewsView reviews={mockData.reviews} />}
      customer={<CustomerReviews />}
    />
  );
}
export default ReviewsPage;
