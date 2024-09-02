import { useDispatch } from "react-redux";
import { createReview, getSpotReviews} from "../../store/reviews";
import { getSpot } from "../../store/spots";
import { useState } from "react";
import { useModal } from "../../context/Modal";
import './ReviewForm.css';

export const ReviewForm = ({ spotId }) => {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (review.length < 10 || stars < 1) {
      setErrors({ message: "Review must be at least 10 characters and include a star rating." });
      return;
    }
  
    const newReview = { review, stars, spotId };
  
    try {
      const response = await dispatch(createReview(newReview));
      if (response) {
        await dispatch(getSpotReviews(spotId));
        await dispatch(getSpot(spotId));
        setStars(0);
        setReview("");
        closeModal()
      }
    } catch (error) {
      setErrors({ message: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h2>How was your stay?</h2>
      {errors.message && <p className="error">{errors.message}</p>}
      <label>
        <textarea
          value={review}
          placeholder="Just a quick review..."
          onChange={(e) => setReview(e.target.value)}
          required
        />
      </label>
      <div className="star-rating">
        {[...Array(5)].map((_, index) => {
          index += 1;
          return (
            <button
              type="button"
              key={index}
              className={index <= stars ? "on" : "off"}
              onClick={() => setStars(index)}
            >
              <span className="star">&#9733;</span>
            </button>
          );
        })}
        <span>{stars} Stars</span>
      </div>
      <button type="submit" disabled={review.length < 10 || stars < 1}>
        Submit Your Review
      </button>
    </form>
  );
};