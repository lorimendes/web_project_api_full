import logo from "../../images/Vector.png";
import { useRef, useEffect, useState } from "react";
import { FormValidator } from "../../utils/formValidator";
import Popup from "../Main/components/Popup/Popup";

function Auth({ title, children, onSubmit, popup, onClosePopup }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const formRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  useEffect(() => {
    const formValidator = new FormValidator(formRef.current, "auth");
    formValidator.enableValidation();
  }, []);

  return (
    <div className="page">
      <header className="header">
        <div className="header__container">
          <div className="header__content">
            <img
              src={logo}
              alt="Logo Around The U.S."
              className="header__logo"
            />
            <h1 className="header__text">{title}</h1>
          </div>
          <div className="header__line"></div>
        </div>
      </header>
      <main>
        <section className="auth">
          <h2 className="auth__title">{title}</h2>
          <form
            className="auth__form"
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
          >
            <input
              id="email-input"
              className="auth__input"
              type="email"
              name="email"
              placeholder="E-mail"
              autoComplete="current-password"
              onChange={handleChange}
              required
            />
            <span className="email-input-error auth__input-error"></span>
            <input
              id="password-input"
              className="auth__input"
              type="password"
              name="password"
              placeholder="Senha"
              autoComplete="current-password"
              onChange={handleChange}
              required
            />
            <span className="password-input-error auth__input-error"></span>
            <div className="auth__spacer"></div>
            {children}
          </form>
        </section>
        {popup && (
          <Popup onClose={onClosePopup} isMessagePopup={true}>
            {popup.children}
          </Popup>
        )}
      </main>
    </div>
  );
}

export default Auth;
