import api from "./api";

export const getPhotos = (category) => api.get("/gallery", { params: { category } });
export const uploadPhoto = (data) => api.post("/gallery", data);
export const approvePhoto = (id) => api.patch(`/gallery/${id}/approve`);
export const deletePhoto = (id) => api.delete(`/gallery/${id}`);
export const getPendingPhotos = () => api.get("/gallery/pending");
