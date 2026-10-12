import { useContext } from "react";
import { CurrentUserContext } from "../../../../../../contexts/CurrentUserContext";

function ConfirmDelete() {
  const { handleCardDeleteConfirm, isLoading } = useContext(CurrentUserContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    handleCardDeleteConfirm();
  };

  return (
    <form className="popup__form" onSubmit={handleSubmit}>
      <button
        className={`popup__submit-button popup__submit-button_remove-card ${
          isLoading ? "popup__submit-button_loading" : ""
        }`}
        type="submit"
      >
        {isLoading ? "Excluindo..." : "Sim"}
      </button>
    </form>
  );
}

export default ConfirmDelete;
