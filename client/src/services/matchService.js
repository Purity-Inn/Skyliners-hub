import api from "./api";

export const getMatches = (status) => api.get("/matches", { params: { status } });
export const getMatch = (id) => api.get(`/matches/${id}`);
export const createMatch = (data) => api.post("/matches", data);
export const updateMatch = (id, data) => api.put(`/matches/${id}`, data);
export const deleteMatch = (id) => api.delete(`/matches/${id}`);
