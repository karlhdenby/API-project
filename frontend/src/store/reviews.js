import { csrfFetch } from "./csrf";

const CREATE_REVIEW = "spots/id/createReview";
const GET_CURRENT_REVIEWS = "spots/reviews/getCurrentReviews";
const DELETE_REVIEW = "spots/reviews/id/deleteReview";
const UPDATE_REVIEW = "spots/reviews/current/updateReview";
const GET_SPOT_REVIEWS = "spots/reviews/id/getSpotReviews";

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

const loadSpotReviews = (reviews) => {
  return {
    type: GET_SPOT_REVIEWS,
    payload: reviews,
  };
};

const deleteReview = (review) => {
  return {
    type: DELETE_REVIEW,
    payload: review,
  };
};

const updateReview = (review) => {
  return {
    type: UPDATE_REVIEW,
    payload: review,
  };
};

export const createReview = (review) => async (dispatch) => {
  // console.log(review);
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
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create review");
    }
  } catch (error) {
    const errorData = await error.json();
    console.log(errorData)
    throw new Error(errorData.message || "Failed to create review");
  }
};

export const getCurrentReviews = () => async (dispatch) => {
  const response = await csrfFetch("/api/reviews/current");

  if (response.ok) {
    const data = await response.json();
    console.log(data);

    dispatch(loadCurrentReviews(data.Reviews));
    return data.Reviews;
  }
};

export const getSpotReviews = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${id}/reviews`);

  if (response.ok) {
    const data = await response.json();
    console.log(data);

    dispatch(loadSpotReviews(data.Reviews));
    return data;
  } else {
    console.error("Failed to fetch reviews");
  }
};

export const reviewDelete = (reviewId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      dispatch(deleteReview(reviewId));
      return response;
    }
  } catch (error) {
    const errorData = await error.json();
    console.log("error!!!!", errorData);
    throw new Error(errorData.message || "Failed to delete review");
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
    case GET_SPOT_REVIEWS: {
      const allReviews = {};
      action.payload.forEach((review) => {
        allReviews[review.id] = review;
      });
      return { ...state, ...allReviews };
    }

    case DELETE_REVIEW: {
      const newState = { ...state };

      delete newState[action.payload];
      return newState;
    }
    default:
      return state;
  }
};

export default reviewReducer;
