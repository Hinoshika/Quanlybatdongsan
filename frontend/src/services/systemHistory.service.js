import axios from "axios";

const API_URL = "http://localhost:5000/api/lich-su-chinh-sua";

const normalize = (res) => res?.data || res;

// ================= GET ALL (WITH FILTERS) =================
export const getSystemHistory = async (params = {}) => {
    const res = await axios.get(API_URL, { params });
    return normalize(res);
};

// ================= GET BY ID =================
export const getSystemHistoryById = async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return normalize(res);
};

// ================= CREATE =================
export const createSystemHistory = async (data) => {
    const res = await axios.post(API_URL, data);
    return normalize(res);
};