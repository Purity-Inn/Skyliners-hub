import api from "./api";

export const getPlayers = () => api.get("/players");
export const getPlayer = (id) => api.get(`/players/${id}`);
export const createPlayer = (data) => api.post("/players", data);
export const updatePlayer = (id, data) => api.put(`/players/${id}`, data);
export const deletePlayer = (id) => api.delete(`/players/${id}`);
export const getUpcomingBirthdays = () => api.get("/players/birthdays");
