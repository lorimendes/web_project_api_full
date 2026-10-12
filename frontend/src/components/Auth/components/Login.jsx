import { Link } from "react-router-dom";
import { useContext } from "react";
import { CurrentUserContext } from "../../../contexts/CurrentUserContext";

function Login() {
  const { isLoading } = useContext(CurrentUserContext);
  return (
    <>
      <button
        className={`auth__submit-button ${isLoading ? "auth__submit-button_loading" : ""}`}
        type="submit"
      >
        Entrar
      </button>
      <Link className="auth__text" to="/signup">
        Ainda não é membro? Inscreva-se aqui!
      </Link>
    </>
  );
}

export default Login;
