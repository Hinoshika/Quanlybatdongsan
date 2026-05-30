import axios from "axios";

const API =
    "http://localhost:5000/api/so-huu-thua-dat";

// ================= GET ALL =================

export const getSoHuuThuaDat = () =>
    axios.get(API);

// ================= GET BY ID =================

export const getSoHuuThuaDatById = (
    id
) =>
    axios.get(`${API}/${id}`);

// ================= GET BY THỬA ĐẤT =================

export const getSoHuuByThuaDatId = (
    thuaDatId
) =>
    axios.get(
        `${API}/thua-dat/${thuaDatId}`
    );

// ================= CREATE =================

export const createSoHuuThuaDat = (
    data
) =>
    axios.post(API, data);

// ================= UPDATE =================

export const updateSoHuuThuaDat = (
    id,
    data
) =>
    axios.put(
        `${API}/${id}`,
        data
    );

// ================= CLOSE =================

export const closeSoHuuThuaDat = (
    id,
    ngay_ket_thuc
) =>
    axios.put(
        `${API}/${id}/close`,
        {
            ngay_ket_thuc
        }
    );

// ================= DELETE =================

export const deleteSoHuuThuaDat = (
    id
) =>
    axios.delete(`${API}/${id}`);

export const transferSoHuuThuaDat = (data) =>
    axios.post(`${API}/transfer`, data);