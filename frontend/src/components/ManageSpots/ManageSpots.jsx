import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentSpots } from "../../store/spots";
import ConfirmDeleteSpotModal from "../ConfirmSpotDeleteModal/ConfirmDeleteSpotModal.jsx";
import { useModal } from "../../context/Modal";
import "../Spots/Spots.css";

export const CurrentSpots = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setModalContent, setOnModalClose } = useModal();
  const spots = useSelector((state) => state.spots);
  const spotsArr = Object.values(spots);
  console.log(spotsArr)

  useEffect(() => {
    dispatch(getCurrentSpots());
  }, [dispatch]);

  const handleEdit = (event, spot) => {
    event.stopPropagation();
    navigate(`/spots/${spot.id}/edit`);
  };

  const handleDelete = (event, spotId) => {
    event.stopPropagation();
    setModalContent(<ConfirmDeleteSpotModal spotId={spotId} />);
    setOnModalClose(() => {
      console.log("Modal closed");
    });
  };

  return (
    <div className="spot-container">
      <h1>Manage Your Spots</h1>
      <div className="spots-grid">
        {spotsArr && spotsArr.length > 0 ?
        spotsArr.map((spot) => {
          return (
            <div
              key={spot.id}
              className="spot-card"
              title={spot.name}
              onClick={() => navigate("/spots/" + spot.id)}
              >
              {console.log(spot)}
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
                    <span>⭐ {spot.avgRating?.toFixed(1) || "NEW"}</span>
                  </div>
                </div>
                <p className="spot-price">${spot.price}/night</p>
              </div>
              <div className="button-container">
                <span>
                <button
                  onClick={(e) => handleEdit(e, spot)}
                >
                  Update
                </button>
                </span>
                <span>
                <button id="delete"
                  onClick={(e) => handleDelete(e, spot.id)}
                >
                  Delete
                </button>
                </span>
              </div>
            </div>
          );
        }) : 
        <NavLink to="/spots/new" className="create-spot-button">
        Create a New Spot
      </NavLink>
        }
      </div>
    </div>
  );
};
