const API_BASE = import.meta.env.VITE_API_BASE;

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    let data = text;
    try { data = JSON.parse(text); } catch { }
    throw { status: res.status, data };
  }

  return res.status === 204 ? null : res.json();
}

export const apiService = {
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signup: (userData) =>
    request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  // Admin
  getAdminDashboardStats: () => request("/admin/stats"),
  getUsers: () => request("/admin/users"),
  getStoresForAdmin: () => request("/admin/stores"),

  createUserAdmin: (data) =>
    request("/admin/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createStoreAdmin: (data) =>
    request("/admin/stores", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 🔥 FINAL — OWNER MULTI-STORE API
  getOwnerDashboard: (ownerId) =>
    request(`/owner/${ownerId}/dashboard`),

  // User
  getStoresForUser: () => request("/stores"),

  submitRating: (userId, storeId, rating) =>
    request(`/stores/${storeId}/rating`, {
      method: "POST",
      body: JSON.stringify({ userId, rating }),
    }),

  updatePassword: (userId, currentPassword, newPassword) =>
    request(`/users/${userId}/password`, {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};
