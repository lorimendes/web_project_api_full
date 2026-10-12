function InfoTooltip({ message, statusIcon }) {
  return (
    <div className="popup__container-message">
      <img src={statusIcon} alt="" className="popup__status-img" />
      <p className="popup__title">{message}</p>
    </div>
  );
}

export default InfoTooltip;
