import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { createReview } from "../../store/reviews";
import { useState } from "react";
import { useModal } from "../../context/Modal";

export const ReviewForm = ({ spotId }) => {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReview = { review, stars, spotId, userId: sessionUser.id };

    dispatch(createReview(newReview));

    setStars(0);
    setReview("");
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Post a Review</h2>
      <label>
        Rating:
        <input
          value={stars}
          type="number"
          min="1"
          max="5"
          onChange={(e) => setStars(e.target.value)}
          required
        />
      </label>
      <label>
        Comment:
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
        />
      </label>
      <button type="submit">Submit Review</button>
    </form>
  );
};
