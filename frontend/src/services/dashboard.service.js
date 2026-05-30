const API_URL = "http://localhost:5000";

export const getDashboardStats = async () => {
    return fetch(`${API_URL}/api/dashboard/stats`);
};