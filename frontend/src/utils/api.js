import { getToken } from "./token";

class Api {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  _request(url, method, body) {
    const token = getToken();

    return fetch(url, {
      ...(method && { method: method }),
      headers: {
        authorization: `Bearer ${token}`,
        ...(body && { "Content-Type": "application/json" }),
      },
      ...(body && { body: JSON.stringify(body) }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      const error = new Error(`Error: ${res.status}`);
      error.status = res.status;
      throw error;
    });
  }

  getProfile() {
    return this._request(`${this.baseUrl}/users/me`);
  }

  getCards() {
    return this._request(`${this.baseUrl}/cards`);
  }

  updateProfile({ name, about }) {
    return this._request(`${this.baseUrl}/users/me`, "PATCH", { name, about });
  }

  updateAvatar({ avatar }) {
    return this._request(`${this.baseUrl}/users/me/avatar`, "PATCH", {
      avatar,
    });
  }

  postCard({ name, link }) {
    return this._request(`${this.baseUrl}/cards`, "POST", {
      name,
      link,
    });
  }

  deleteCard(cardToDelete) {
    return this._request(`${this.baseUrl}/cards/${cardToDelete._id}`, "DELETE");
  }

  putLike(cardToUpdate) {
    return this._request(
      `${this.baseUrl}/cards/${cardToUpdate._id}/likes`,
      "PUT",
    );
  }

  deleteLike(cardToUpdate) {
    return this._request(
      `${this.baseUrl}/cards/${cardToUpdate._id}/likes`,
      "DELETE",
    );
  }
}

const api = new Api("https://api.lorena.estradatech.com");

export { api };
