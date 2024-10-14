import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllSpots } from "../../store/spots";
import { useNavigate } from "react-router-dom";
import "./Spots.css";

export const Spots = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [spots, setSpots] = useState([]);
  console.log(spots);

  useEffect(() => {
    const fetchSpots = async () => {
      const allSpots = await dispatch(getAllSpots());
      console.log(allSpots)
      setSpots(allSpots);
    };
    fetchSpots();
  }, [dispatch]);
  

  return (
    <div className="spots-grid">
      {(Object.values(spots)).map((spot) => (
        <div
        onClick={() => navigate(`/spots/${spot.id}`)}
        key={spot.id}
        className="spot-card"
        >
          <img
            src={spot.previewImage || "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png"}
            alt={`Preview of ${spot.name}`}
          />
          <div className="spot-info">
            <div className="spot-name">{spot.name}</div>
            <div className="spot-details">
              <p>
                {spot.city}, {spot.state}
              </p>
              <div className="spot-rating">⭐ {spot.avgRating?.toFixed(1) || "NEW"}</div>
              {console.log(parseInt(spot.avgRating).toFixed(1))}
            </div>
            <p className="spot-price">${spot.price}/night</p>
          </div>
          <div className="tooltiptext">{spot.name}</div>
        </div>
      ))}
    </div>
  );
};

export default Spots;