import { Link } from "react-router-dom";
import { useContext } from "react";
import { CurrentUserContext } from "../../../contexts/CurrentUserContext";

function Register() {
  const { isLoading } = useContext(CurrentUserContext);
  return (
    <>
      <button
        className={`auth__submit-button ${isLoading ? "auth__submit-button_loading" : ""}`}
        type="submit"
      >
        Inscrever-se
      </button>
      <Link className="auth__text" to="/signin">
        Já é um membro? Faça o login aqui!
      </Link>
    </>
  );
}

export default Register;
