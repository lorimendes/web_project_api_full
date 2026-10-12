class FormValidator {
  constructor(form, component) {
    this._form = form;
    this._component = component;
  }

  _showError(input, errorMessage) {
    const inputError = this._form.querySelector(`.${input.id}-error`);
    input.classList.add(this._component + "__input_type_error");
    inputError.textContent = errorMessage;
    inputError.classList.add(this._component + "__input-error_active");

    this._form.parentElement.addEventListener("click", (evt) => {
      if (evt.target.classList.contains(this._component + "__close-button")) {
        this._hideError(input);
      }
    });
  }

  _hideError(input) {
    const inputError = this._form.querySelector(`.${input.id}-error`);
    input.classList.remove(this._component + "__input_type_error");
    inputError.textContent = "";
    inputError.classList.remove(this._component + "__input-error_active");
  }

  _isValid(input) {
    if (!input.validity.valid) {
      this._showError(input, input.validationMessage);
    } else {
      this._hideError(input);
    }
  }

  _hasInvalidInput(inputList) {
    return inputList.some((input) => {
      return !input.validity.valid;
    });
  }

  _toggleButtonState(inputList, button) {
    if (this._hasInvalidInput(inputList)) {
      button.classList.add(this._component + "__submit-button_inactive");
      button.setAttribute("disabled", "");
    } else {
      button.classList.remove(this._component + "__submit-button_inactive");
      button.removeAttribute("disabled", "");
    }
  }

  _setInputEventListeners() {
    const inputList = Array.from(
      this._form.querySelectorAll("." + this._component + "__input"),
    );
    const button = this._form.querySelector(
      "." + this._component + "__submit-button",
    );
    this._toggleButtonState(inputList, button);
    inputList.forEach((input) => {
      input.addEventListener("input", () => {
        this._isValid(input);
        this._toggleButtonState(inputList, button);
      });
    });
  }

  enableValidation() {
    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();
    });
    this._setInputEventListeners();
  }
}

export { FormValidator };
