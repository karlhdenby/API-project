import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = "spots/getAllSpots";
const GET_CURRENT_SPOTS = "spots/getCurrentSpots";
const GET_SPOT = "spots/getOneSpot";
const CREATE_SPOT = "spots/createSpot";
const CREATE_IMAGES = "spots/createSpotImages";
const UPDATE_SPOT = "spots/id/updateSpot";
const DELETE_SPOT = "spots/id/deleteSpot"

const GET_CURRENT_REVIEWS = "spots/reviews/getCurrentReviews";

const loadSpots = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    payload: spots,
  };
};

const loadCurrentSpots = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    payload: spots,
  };
};

const loadSpot = (spot) => {
  return {
    type: GET_SPOT,
    payload: spot,
  };
};

const newSpot = (spot) => {
  return {
    type: CREATE_SPOT,
    payload: spot,
  };
};

const updateSpot = (spot) => {
  return {
    type: UPDATE_SPOT,
    payload: spot,
  };
};

const deleteSpot = (spot) => {
  return {
    type: UPDATE_SPOT,
    payload: spot,
  };
};

const loadCurrentReviews = (reviews) => {
  return {
    type: GET_ALL_REVIEWS,
    payload: reviews,
  };
};

// const newImages = (images) => {
//   return {
//     type: CREATE_IMAGES,
//     payload: images
//   }
// }

export const getAllSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");

  if (response.ok) {
    const data = await response.json();

    dispatch(loadSpots(data.Spots));
    return data.Spots;
  }
};

export const getCurrentSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots/current");

  if (response.ok) {
    const data = await response.json();

    dispatch(loadCurrentSpots(data.Spots));
    return data.Spots;
  }
};

export const getSpot = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${id}`);
  if (response.ok) {
    const data = await response.json();
    console.log(data);
    dispatch(loadSpot(data));
    return data;
  }
};

export const createSpot = (spot) => async (dispatch) => {
  console.log(spot);
  try {
    const response = await csrfFetch("/api/spots", {
      method: "POST",
      body: JSON.stringify(spot),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("okay!");
      const spot = await response.json();
      dispatch(newSpot(spot));

      return spot.id;
    }
  } catch (error) {
    console.log("error!!!!", await error.json());
  }
};

export const editSpot = (spot) => async (dispatch) => {
  console.log("spot!", spot);
  try {
    const response = await csrfFetch(`/api/spots/${spot.id}`, {
      method: "PUT",
      body: JSON.stringify(spot),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("okay!");
      const newSpot = await response.json();
      dispatch(updateSpot(newSpot));

      return newSpot;
    }
  } catch (error) {
    console.log("error!!!!", await error.json());
  }
};

export const spotDelete = (spot) => async (dispatch) => {
  console.log("spot!", spot);
  try {
    const response = await csrfFetch(`/api/spots/${spot.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("okay!");
      const newSpot = await response.json();
      dispatch(deleteSpot(spot.id));

      return newSpot;
    }
  } catch (error) {
    console.log("error!!!!", await error.json());
  }
};

export const getCurrentReviews = () => async (dispatch) => {
  const response = await csrfFetch("/api/reviews/current");

  if (response.ok) {
    const data = await response.json();

    dispatch(loadCurrentReviews(data.reviews));
    return data.reviews;
  }
};

// export const createSpotImages = (images) => async (dispatch) => {
//   const response = await csrfFetch('/api/spots/images', {
//     method: 'POST',
//     body: JSON.stringify(images),
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })

//   if (response.ok) {
//     const images = await response.json();
//     dispatch()
//   }
// }

const initialState = {};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS: {
      const allSpots = {};
      action.payload.forEach((spot) => (allSpots[spot.id] = spot));
      return allSpots;
    }
    case GET_SPOT: {
      const newState = { ...state, detail: action.payload };
      return newState;
    }
    case CREATE_SPOT: {
      const newState = { ...state };

      newState[action.payload.id] = action.payload;
      return newState;
    }
    case UPDATE_SPOT: {
      const newState = { ...state };

      newState[action.payload.id] = action.payload;
      return newState;
    }
    case CREATE_IMAGES: {
      const newState = { ...state };

      newState[action.payload.id] = action.payload;
      return newState;
    }
    case GET_CURRENT_SPOTS: {
      const allSpots = {};
      action.payload.forEach((spot) => (allSpots[spot.id] = spot));
      return allSpots;
    }
    case DELETE_SPOT: {
      const newState = { ...state };

      delete newState[action.payload]
      return newState;
    }
    case GET_CURRENT_REVIEWS: {
      const allReviews = {};
      action.payload.forEach((spot) => (allReviews[spot.id] = spot));
      return allReviews;
    }

    default:
      return state;
  }
};

export default spotsReducer;
