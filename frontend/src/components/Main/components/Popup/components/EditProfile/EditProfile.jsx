import { useContext, useEffect, useState, useRef } from "react";
import { CurrentUserContext } from "../../../../../../contexts/CurrentUserContext";
import { FormValidator } from "../../../../../../utils/formValidator";

function EditProfile() {
  const userContext = useContext(CurrentUserContext);
  const { currentUser, handleUpdateUser, isLoading } = userContext;
  const formRef = useRef();

  const [name, setName] = useState(currentUser?.name);
  const [about, setAbout] = useState(currentUser?.about);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleAboutChange = (event) => {
    setAbout(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleUpdateUser({ name, about });
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
        id="name-input"
        className="popup__input popup__input_content_name"
        type="text"
        minLength="2"
        maxLength="40"
        name="name"
        placeholder="Nome"
        value={name}
        onChange={handleNameChange}
        required
      />
      <span className="name-input-error popup__input-error"></span>
      <input
        id="about-input"
        className="popup__input popup__input_content_about"
        type="text"
        minLength="2"
        maxLength="200"
        name="about"
        placeholder="Sobre mim"
        value={about}
        onChange={handleAboutChange}
        required
      />
      <span className="about-input-error popup__input-error"></span>
      <button
        id="edit-profile-button"
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

export default EditProfile;
