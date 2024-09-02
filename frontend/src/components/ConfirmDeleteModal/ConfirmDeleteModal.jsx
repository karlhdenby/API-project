import { useDispatch } from 'react-redux';
import { reviewDelete } from '../../store/reviews';
import { useModal } from '../../context/Modal';
import "./ConfirmDeleteModal.css"

function ConfirmDeleteModal({ reviewId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    await dispatch(reviewDelete(reviewId));
    closeModal();
  };

  return (
    <div className="confirm-delete-modal">
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to delete this review?</p>
      <div className="button-container">
        <button className="delete-button" onClick={handleDelete}>Yes (Delete Review)</button>
        <button className="cancel-button" onClick={closeModal}>No (Keep Review)</button>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
