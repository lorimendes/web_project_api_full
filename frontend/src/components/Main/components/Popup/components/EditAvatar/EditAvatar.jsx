import { useRef, useContext, useEffect } from "react";
import { CurrentUserContext } from "../../../../../../contexts/CurrentUserContext";
import { FormValidator } from "../../../../../../utils/formValidator";

function EditAvatar() {
  const { handleUpdateAvatar, isLoading } = useContext(CurrentUserContext);
  const avatarRef = useRef();
  const formRef = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();

    handleUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  };

  useEffect(() => {
    const formValidator = new FormValidator(formRef.current, "popup");
    formValidator.enableValidation();
  }, []);

  return (
    <form
      ref={formRef}
      className="popup__form"
      noValidate
      onSubmit={handleSubmit}
    >
      <input
        ref={avatarRef}
        id="avatar-input"
        className="popup__input popup__input_content_link"
        type="url"
        name="avatar"
        placeholder="Link de imagem"
        required
      />
      <span className="avatar-input-error popup__input-error"></span>
      <button
        id="avatar-button"
        className={`popup__submit-button ${
          isLoading ? "popup__submit-button_loading" : ""
        }`}
        type="submit"
      >
        {isLoading ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}

export default EditAvatar;
