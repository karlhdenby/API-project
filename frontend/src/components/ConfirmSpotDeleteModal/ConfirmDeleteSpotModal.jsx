import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { spotDelete, getCurrentSpots } from '../../store/spots';
import './ConfirmDeleteSpotModal.css';

const ConfirmDeleteSpotModal = ({spotId}) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    console.log('Deleting spot with id:', spotId);
    try {
      await dispatch(spotDelete(spotId)); 
      dispatch(getCurrentSpots());
      closeModal();
    } catch (error) {
      console.error("Failed to delete spot:", error);
    }
  };

  return (
    <div className="confirm-delete-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this spot from the listings?</p>
      <div className="confirm-delete-buttons">
        <button onClick={handleDelete} className="delete-button">
          Yes (Delete Spot)
        </button>
        <button onClick={closeModal} className="cancel-button">
          No (Keep Spot)
        </button>
      </div>
    </div>
  );
};

export default ConfirmDeleteSpotModal;
