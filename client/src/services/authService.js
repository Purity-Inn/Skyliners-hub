import api from "./api";

export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");
export const getUsers = () => api.get("/auth/users");
export const updateUserRole = (id, role) => api.put(`/auth/users/${id}/role`, { role });
export const deleteUser = (id) => api.delete(`/auth/users/${id}`);
