import api from "./api";

export const getLeadership = () => api.get("/leadership");
export const updateLeadership = (data) => api.put("/leadership", data);
