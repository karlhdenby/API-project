import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentSpots } from "../../store/spots";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ConfirmDeleteSpotModal from "../ConfirmSpotDeleteModal/ConfirmDeleteSpotModal.jsx";
import "../Spots/Spots.css";

export const CurrentSpots = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots);
  const spotsArr = Object.values(spots);

  useEffect(() => {
    dispatch(getCurrentSpots());
  }, [dispatch]);

  const handleEdit = (spot) => {
    navigate(`/spots/${spot.id}/edit`);
  };

  return (
    <div className="spot-container">
      <h1>Manage Your Spots</h1>
      <NavLink to="/spots/new" className="create-spot-button">
        Create a New Spot
      </NavLink>
      <div className="spots-grid">
        {spotsArr?.map((spot) => (
          <div key={spot.id} className="spot-card" title={spot.name}>
            <img
              src={spot.previewImage || "https://via.placeholder.com/150"}
              alt={`Preview of ${spot.name}`}
            />
            <div className="spot-info">
              <div className="spot-details">
                <p>
                  {spot.city}, {spot.state}
                </p>
                <div className="spot-rating">
                  <span>⭐ {spot.avgStarRating || "NEW"}</span>
                </div>
              </div>
              <p className="spot-price">${spot.price}/night</p>
            </div>
            <div className="spot-buttons">
              <button
                className="update-button"
                onClick={() => handleEdit(spot)}
              >
                Update
              </button>
              {console.log(spot.id)}
              <OpenModalButton
                modalComponent={<ConfirmDeleteSpotModal spotId={spot.id} />}
                buttonText="Delete"
                className="delete-button"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
