import axios from "axios";

const API =
    "http://localhost:5000/api/so-huu-cong-trinh";

// ================= GET ALL =================
export const getSoHuuCongTrinh = async () => {

    try {

        const res = await axios.get(API);

        return res.data;

    } catch (err) {

        console.error(
            "getSoHuuCongTrinh error:",
            err
        );

        return [];
    }
};

// ================= GET BY ID =================
export const getSoHuuCongTrinhById = async (id) => {

    try {

        const res = await axios.get(
            `${API}/${id}`
        );

        return res.data;

    } catch (err) {

        console.error(
            "getSoHuuCongTrinhById error:",
            err
        );

        return null;
    }
};

// ================= GET BY CÔNG TRÌNH =================
export const getChuSoHuuCongTrinh = async (
    congTrinhId
) => {

    try {

        const res = await axios.get(
            `${API}/cong-trinh/${congTrinhId}`
        );

        return res.data;

    } catch (err) {

        console.error(
            "getChuSoHuuCongTrinh error:",
            err
        );

        return [];
    }
};

// ================= CREATE =================
export const createSoHuuCongTrinh = async (
    payload
) => {

    try {

        const res = await axios.post(
            API,
            payload
        );

        return res.data;

    } catch (err) {

        console.error(
            "createSoHuuCongTrinh error:",
            err
        );

        throw err;
    }
};

// ================= UPDATE =================
export const updateSoHuuCongTrinh = async (
    id,
    payload
) => {

    try {

        const res = await axios.put(
            `${API}/${id}`,
            payload
        );

        return res.data;

    } catch (err) {

        console.error(
            "updateSoHuuCongTrinh error:",
            err
        );

        throw err;
    }
};

// ================= CLOSE OWNERSHIP =================
export const closeSoHuuCongTrinh = async (
    id,
    payload
) => {

    try {

        const res = await axios.put(
            `${API}/${id}`,
            payload
        );

        return res.data;

    } catch (err) {

        console.error(
            "closeSoHuuCongTrinh error:",
            err
        );

        throw err;
    }
};

// ================= DELETE =================
export const deleteSoHuuCongTrinh = async (
    id
) => {

    try {

        const res = await axios.delete(
            `${API}/${id}`
        );

        return res.data;

    } catch (err) {

        console.error(
            "deleteSoHuuCongTrinh error:",
            err
        );

        throw err;
    }
};

// ================= TRANSFER =================
export const chuyenNhuongCongTrinh = async (
    payload
) => {

    try {

        const res = await axios.post(
            `${API}/transfer`,
            payload
        );

        return res.data;

    } catch (err) {

        console.error(
            "chuyenNhuongCongTrinh error:",
            err
        );

        throw err;
    }
};