import { useContext } from "react";
import Popup from "./components/Popup/Popup.jsx";
import NewCard from "./components/Popup/components/NewCard/NewCard.jsx";
import EditAvatar from "./components/Popup/components/EditAvatar/EditAvatar.jsx";
import EditProfile from "./components/Popup/components/EditProfile/EditProfile.jsx";
import Card from "./components/Card/Card.jsx";
import { CurrentUserContext } from "../../contexts/CurrentUserContext.js";
import ConfirmDelete from "./components/Popup/components/ConfirmDelete/ConfirmDelete.jsx";

function Main(props) {
  const { currentUser } = useContext(CurrentUserContext);

  const newCardPopup = { title: "Novo Local", children: <NewCard /> };
  const editAvatarPopup = {
    title: "Alterar a foto do perfil",
    children: <EditAvatar />,
  };
  const editProfilePopup = {
    title: "Editar perfil",
    children: <EditProfile />,
  };
  const confirmDeletePopup = {
    title: "Tem certeza?",
    children: <ConfirmDelete />,
  };

  const verifyCardLike = (likes) => {
    return likes.some((like) => {
      return like === currentUser._id;
    });
  };

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__avatar-container">
          <img
            className="profile__avatar"
            src={currentUser && currentUser.avatar}
            alt={`Foto de ${currentUser?.name}`}
          />
          <button
            className="profile__avatar-button"
            type="button"
            onClick={() => props.onOpenPopup(editAvatarPopup)}
          ></button>
        </div>
        <div className="profile__info">
          <h1 className="profile__name">{currentUser?.name}</h1>
          <p className="profile__about">{currentUser?.about}</p>
          <button
            className="profile__edit-button"
            type="button"
            onClick={() => {
              props.onOpenPopup(editProfilePopup);
            }}
          ></button>
        </div>
        <button
          className="profile__add-button"
          onClick={() => props.onOpenPopup(newCardPopup)}
        ></button>
      </section>
      <ul className="gallery">
        {props.cards &&
          props.cards.map((card) => {
            return (
              <Card
                key={card._id}
                name={card.name}
                link={card.link}
                isLiked={verifyCardLike(card.likes)}
                onOpen={props.onOpenPopup}
                onCardLike={() => props.onCardLike(card)}
                onCardDislike={() => props.onCardDislike(card)}
                onOpenConfirmDelete={() => {
                  props.onOpenPopup(confirmDeletePopup);
                  props.onClickDeleteCard(card);
                }}
              />
            );
          })}
      </ul>
      {props.popup && (
        <Popup onClose={props.onClosePopup} title={props.popup.title}>
          {props.popup.children}
        </Popup>
      )}
    </main>
  );
}

export default Main;
