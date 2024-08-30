import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import * as spotActions from "../../store/spots";
import { useParams } from "react-router-dom";
import {ReviewForm} from '../ReviewModal/ReviewModal'
import OpenModalButton from '../OpenModalButton/OpenModalButton';

export const Spot = () => {
  const sessionUser = useSelector((state) => state.session.user);
  console.log('spot function')
  const dispatch = useDispatch();
  const { id } = useParams();
  
  const spot = useSelector((state) => state.spots.detail);
  console.log(spot)

  useEffect(() => {
    dispatch(spotActions.getSpot(id));
  }, [dispatch, id]);


  if (!spot) {
		return <h1 style={{ color: "brown", textAlign: "center" }}>Loading...</h1>;
	}
  
  return (
    <>
      <h1>Name: {spot.name}</h1>
      <h2>Location: {`${spot.city}, ${spot.state}`}</h2>
      <h3>Address: {spot.address}</h3>
      {sessionUser.id !== spot.ownerId && (
        <OpenModalButton
          modalComponent={<ReviewForm spotId={id}/>} // Your review form component
          buttonText="Post a review"
          onModalClose={() => console.log('Review Modal closed')}
        />
      )}
    </>
  );
};