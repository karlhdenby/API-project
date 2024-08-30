import { csrfFetch } from "./csrf";

const CREATE_REVIEW = "spots/id/createReview";
const GET_CURRENT_REVIEWS = "spots/reviews/getCurrentReviews";
const DELETE_REVIEW = "spots/reviews/id/deleteReview"
const UPDATE_REVIEW = "spots/reviews/current/updateReview"

const newReview = (review) => {
  return {
    type: CREATE_REVIEW,
    payload: review,
  };
};

const loadCurrentReviews = (reviews) => {
  return {
    type: GET_CURRENT_REVIEWS,
    payload: reviews,
  };
};

const deleteReview = (review) => {
  return {
    type: DELETE_REVIEW,
    payload: review
  }
}

const updateReview = (review) => {
  return {
    type: UPDATE_REVIEW,
    payload: review,
  };
};

export const createReview = (review) => async (dispatch) => {
  console.log(review);
  try {
    const response = await csrfFetch(`/api/spots/${review.spotId}/reviews`, {
      method: "POST",
      body: JSON.stringify(review),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const review = await response.json();
      dispatch(newReview(review));

      return review;
    }
  } catch (error) {
    console.log("error!!!", await error.json());
  }
};

export const getCurrentReviews = () => async (dispatch) => {
  const response = await csrfFetch("/api/reviews/current");

  if (response.ok) {
    const data = await response.json();
    console.log(data)

    dispatch(loadCurrentReviews(data.Reviews));
    return data.Reviews;
  }
};

export const reviewDelete = (review) => async (dispatch) => {
  console.log("review!", review);
  try {
    const response = await csrfFetch(`/api/reviews/${review.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("okay!");
      const newReview = await response.json();
      dispatch(deleteReview(review.id));

      return newReview;
    }
  } catch (error) {
    console.log("error!!!!", await error.json());
  }
};

export const editReview = (review) => async (dispatch) => {
  console.log("review!", review);
  try {
    const response = await csrfFetch(`/api/reviews/${review.id}`, {
      method: "PUT",
      body: JSON.stringify(review),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("okay!");
      const newReview = await response.json();
      dispatch(updateReview(newReview));

      return newReview;
    }
  } catch (error) {
    console.log("error!!!!", await error.json());
  }
};

const initialState = {};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_REVIEW: {
      const newState = { ...state };

      newState[action.payload.id] = action.payload;
      return newState;
    }
    case GET_CURRENT_REVIEWS: {
      const allReviews = {};
      action.payload.forEach((review) => (allReviews[review.id] = review));
      return allReviews;
    }
    case DELETE_REVIEW: {
      const newState = { ...state };

      delete newState[action.payload]
      return newState;
    }
    case UPDATE_REVIEW: {
      const newState = { ...state };

      delete newState[action.payload]
      return newState;
    }
    default:
      return state;
  }
};

export default reviewReducer;
