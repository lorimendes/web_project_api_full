import ImagePopup from "../Popup/components/ImagePopup/ImagePopup";

function Card({
  name,
  link,
  onOpen,
  isLiked,
  onCardLike,
  onCardDislike,
  onOpenConfirmDelete,
}) {
  const cardLikeButtonClassName = `gallery__like-button ${
    isLiked ? "gallery__like-button_active" : ""
  }`;

  return (
    <li className="gallery__photo-card">
      <img
        className="gallery__photo"
        src={link}
        alt={name}
        onClick={() =>
          onOpen({
            children: <ImagePopup name={name} link={link} />,
          })
        }
      />
      <div className="gallery__photo-info">
        <p className="gallery__photo-caption">{name}</p>
        <button
          className={cardLikeButtonClassName}
          aria-label="Curtir card"
          onClick={isLiked ? onCardDislike : onCardLike}
        ></button>
        <button
          className="gallery__remove-button"
          aria-label="Remover card"
          onClick={onOpenConfirmDelete}
        ></button>
      </div>
    </li>
  );
}

export default Card;
