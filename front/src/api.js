const API_URL = "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const api = {
  getMe: () => request("/auth/me"),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  getLocale: () => request("/session/locale"),
  setLocale: (locale) => request("/session/locale", { method: "POST", body: JSON.stringify({ locale }) }),
  getProducts: () => request("/products"),
  getProduct: (id) => request(`/products/${id}`),
  likeProduct: (id) => request(`/products/${id}/like`, { method: "POST" }),
  addReview: (id, payload) =>
    request(`/products/${id}/reviews`, { method: "POST", body: JSON.stringify(payload) }),
  getAdminProducts: () => request("/admin/products"),
  createProduct: (payload) => request("/admin/products", { method: "POST", body: JSON.stringify(payload) }),
  updateProduct: (id, payload) =>
    request(`/admin/products/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
};
