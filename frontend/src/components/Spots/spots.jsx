import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {getAllSpots} from "../../store/spots";

export const Spots = () => {
  const dispatch = useDispatch();
  
  const spots = useSelector((state) => state.spots);
  const spotsArr = Object.values(spots);

  useEffect(() => { 
    dispatch(getAllSpots());
  }, [dispatch]);

  return (
    <>
      <h1>Spots</h1>
      {spotsArr?.map(({ id, name }) => (
        <p key={id}>{name}</p>
      ))}
    </>
  );
};