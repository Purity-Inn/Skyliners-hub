import api from "./api";

export const getHof = () => api.get("/hof");
export const createHof = (data) =>
	api.post("/hof", data, data instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined);
export const updateHof = (id, data) =>
	api.put(`/hof/${id}`, data, data instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined);
export const deleteHof = (id) => api.delete(`/hof/${id}`);
