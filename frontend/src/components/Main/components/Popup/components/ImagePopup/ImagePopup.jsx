function ImagePopup({ name, link }) {
  return (
    <>
      <button className="popup__close-button" type="button"></button>
      <img className="popup__photo" src={link} alt={name} />
      <p className="popup__photo-caption">{name}</p>
    </>
  );
}

export default ImagePopup;
