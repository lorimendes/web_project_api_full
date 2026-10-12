function Popup({ title, children, onClose, isMessagePopup }) {
  return (
    <div
      className={`popup ${!title && !isMessagePopup ? "popup_function_open-image" : ""}`}
    >
      <div
        className={`popup__container ${
          !title && !isMessagePopup
            ? "popup__container-image"
            : "popup__container-white"
        }`}
      >
        {title && <h2 className="popup__title">{title}</h2>}
        {children}
        <button
          className="popup__close-button popup__close-button_position_top"
          type="button"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
}

export default Popup;
