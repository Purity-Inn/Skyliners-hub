import api from "./api";

export const getHof = () => api.get("/hof");
export const createHof = (data) => api.post("/hof", data);
export const updateHof = (id, data) => api.put(`/hof/${id}`, data);
export const deleteHof = (id) => api.delete(`/hof/${id}`);
