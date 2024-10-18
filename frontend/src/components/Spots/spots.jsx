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
    <div className="spots-grid" data-testid="spots-list">
      {(Object.values(spots)).map((spot) => (
        <div
        onClick={() => navigate(`/spots/${spot.id}`)}
        key={spot.id}
        data-testid="spot-tile"
        className="spot-card"
        href={`/spots/${spot.id}`}
        >
          <img
            data-testid="spot-thumbnail-image"
            src={spot.previewImage || "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png"}
            alt={`Preview of ${spot.name}`}
          />
          <div className="spot-info" data-testid="spot-tooltip">
            <div className="spot-name">{spot.name}</div>
            <a className="spot-details">
              <div data-testid="spot-city">
              <p>
                {spot.city}, {spot.state}
              </p>
              </div>
              <div data-testid="spot-rating" className="spot-rating">⭐ {spot.avgRating?.toFixed(1) || "NEW"}</div>
              {console.log(parseInt(spot.avgRating).toFixed(1))}
            </a>
            <p data-testid="spot-price" className="spot-price">${spot.price}/night</p>
          </div>
          <div  className="tooltiptext">{spot.name}</div>
        </div>
      ))}
    </div>
  );
};

export default Spots;