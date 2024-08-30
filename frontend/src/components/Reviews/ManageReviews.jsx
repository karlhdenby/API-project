import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCurrentReviews, reviewDelete, editReview } from "../../store/reviews";

export const CurrentReviews = () => {
  const dispatch = useDispatch();

  const reviews = useSelector((state) => state.reviews);
  const reviewsArr = Object.values(reviews);

  console.log(reviews)

  useEffect(() => {
    dispatch(getCurrentReviews());
  }, [dispatch]);

  return (
    <>
      <h1>Manage Reviews</h1>
      {reviewsArr?.map((review) => (
        <>
          <p key={review.id}>{review.review}</p>
            <button onClick={
              () => {
                dispatch(reviewDelete(review))
                window.location.reload()
              }
              }>Delete</button>
              <button onClick={
              () => {
                dispatch(editReview(review))
                window.location.reload()
              }
              }>Update</button>
        </>
      ))}
    </>
  );
};
