import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_URL,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authAPI = {
  login: (email, password) => api.post("/api/auth/login", { email, password }),
  register: (userData) => api.post("/api/auth/register", userData),
  getProfile: () => api.get("/api/auth/profile"),
  updateProfile: (userData) => api.put("/api/auth/profile", userData),
  changePassword: (passwordData) => api.put("/api/auth/change-password", passwordData),
  forgotPassword: (email) => api.post("/api/auth/forgot-password", { email }),
  resetPassword: (resetData) => api.post("/api/auth/reset-password", resetData),
}

// Notes API
export const notesAPI = {
  getNotes: () => api.get("/api/notes"),
  getNoteById: (id) => api.get(`/api/notes/${id}`),
  createNote: (formData) =>
    api.post("/api/notes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateNote: (id, formData) =>
    api.put(`/api/notes/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  toggleFavorite: (id) => api.patch(`/api/notes/${id}/favorite`),
  deleteNote: (id) => api.delete(`/api/notes/${id}`),
  deleteNoteImage: (noteId, imageId) => api.delete(`/api/notes/${noteId}/image/${imageId}`),
}
