import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getSpot } from "../../store/spots";
import { getSpotReviews } from "../../store/reviews";
import { useParams } from "react-router-dom";
import { ReviewForm } from "../ReviewModal/ReviewModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import "./Spot.css";

export const Spot = () => {
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const { id } = useParams();

  const spot = useSelector((state) => state.spots.detail);
  let reviews = useSelector((state) => state.reviews);

  reviews = Object.values(reviews);

  useEffect(() => {
    dispatch(getSpot(id));
    dispatch(getSpotReviews(id));
  }, [dispatch, id]);

  const handleReserve = () => {
    alert("Feature Coming Soon...");
  };

  const formatRating = (rating) => {
    if (rating) {
      return rating.toFixed(1);
    }
    return "NEW";
  };

  if (!spot) {
    return <h1 style={{ color: "brown", textAlign: "center" }}>Loading...</h1>;
  }

  return (
    <div className="spot-container">
      <h1>{spot.name}</h1>
      <h2>{`${spot.city}, ${spot.state}, ${spot.country}`}</h2>

      {/* Images */}
      <div className="image-gallery">
        <div className="main-image">
          <img src={spot.SpotImages[0]?.url} alt={spot.name} />
        </div>
        <div className="other-images">
          {spot.SpotImages.slice(1, 5).map((image, idx) => (
            <img key={idx} src={image.url} alt={`${spot.name} ${idx}`} />
          ))}
        </div>
      </div>

      <div className="spot-details-container">
        <div className="spot-details-left">
          <h3>
            {spot.Owner
              ? `Hosted by ${spot.Owner.firstName} ${spot.Owner.lastName}`
              : "Hosted by: Owner information not available"}
          </h3>
          <p>{spot.description}</p>
        </div>
        <div className="spot-details-right">
          <div className="price-reviews-box">
            <span className="price">
              ${spot.price} <span>night</span>
            </span>
            <div className="reviews">
              <span>
                ★ {formatRating(spot.avgStarRating)} ·{" "}
                {reviews.length === 1
                  ? "1 review"
                  : `${reviews.length} reviews`}
              </span>
            </div>
            <button onClick={handleReserve} className="reserve-button">
              Reserve
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="reviews-section">
        <h3>
          ★ {formatRating(spot.avgStarRating)} ·{" "}
          {reviews.length === 1 ? "1 review" : `${reviews.length} reviews`}
        </h3>
        {sessionUser && sessionUser.id !== spot.ownerId && (
          <OpenModalButton
            modalComponent={<ReviewForm spotId={id} />}
            buttonText="Post a review"
            className="post-review-button"
          />
        )}
        <div>
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="review">
                <h4>{review.User?.firstName || "Anonymous"}</h4>{" "}
                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                <p>{review.review}</p>
                <div className="review-images">
                  {review.ReviewImages?.map((image) => (
                    <img key={image.id} src={image.url} alt="Review" />
                  ))}
                </div>
                {sessionUser && sessionUser.id === review.userId && (
                  <OpenModalButton
                    modalComponent={
                      <ConfirmDeleteModal reviewId={review.id} spotId={id} />
                    }
                    buttonText="Delete"
                    className="delete-review-button"
                  />
                )}
              </div>
            ))
          ) : (
            <p>No reviews available</p>
          )}
        </div>
      </div>
    </div>
  );
};
