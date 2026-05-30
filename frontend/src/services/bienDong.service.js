import axios from "axios";

const API = "http://localhost:5000/api/bien-dong";

// interceptor
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// ================= GET ALL =================
export const getBienDong = (params) =>
    axios.get(API, { params });

// ================= GET BY ID =================
export const getBienDongById = (id) =>
    axios.get(`${API}/${id}`);

// ================= CREATE =================
export const createBienDong = (data) =>
    axios.post(API, data);

// ================= UPDATE =================
export const updateBienDong = (id, data) =>
    axios.put(`${API}/${id}`, data);

// ================= DELETE =================
export const deleteBienDong = (id) =>
    axios.delete(`${API}/${id}`);