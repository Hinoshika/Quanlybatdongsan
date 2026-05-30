import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:5000/api", // đổi theo backend của bạn
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔥 interceptor request (nếu cần token)
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// 🔥 interceptor response
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;