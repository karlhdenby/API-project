import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCurrentSpots, spotDelete } from "../../store/spots";

export const CurrentSpots = () => {
  const dispatch = useDispatch();

  const spots = useSelector((state) => state.spots);
  const spotsArr = Object.values(spots);

  useEffect(() => {
    dispatch(getCurrentSpots());
  }, [dispatch]);

  return (
    <>
      <h1>Manage Spots</h1>
      {spotsArr?.map((spot) => (
        <>
          <p key={spot.id}>{spot.name}</p>
            <button onClick={
              () => {
                dispatch(spotDelete(spot))
                window.location.reload()
              }
              }>Delete</button>
        </>
      ))}
    </>
  );
};
