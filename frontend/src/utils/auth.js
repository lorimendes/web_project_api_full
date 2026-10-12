export const BASE_URL = "https://api.lorena.estradatech.com";

const request = async (url, body) => {
  const res = await fetch(BASE_URL + url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = new Error(`Error: ${res.status}`);
    error.status = res.status;
    throw error;
  }

  return await res.json();
};

export const register = ({ password, email }) => {
  return request("/signup", { password, email });
};

export const authorize = ({ password, email }) => {
  return request("/signin", { password, email });
};
