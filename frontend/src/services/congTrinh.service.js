const API_URL = "http://localhost:5000/api/cong-trinh";

// ================= HANDLE RESPONSE =================
const handleResponse = async (res) => {
    let data = null;

    const text = await res.text();

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = null;
        }
    }

    if (!res.ok) {
        throw new Error(data?.message || "API Error");
    }

    return data;
};

// ================= NORMALIZE =================
const normalizeCongTrinh = (item) => ({
    ...item,

    geom: (() => {
        if (!item.geom) return null;

        if (typeof item.geom === "string") {
            try {
                return JSON.parse(item.geom);
            } catch {
                return null;
            }
        }

        return item.geom;
    })(),

    lat:
        item.geom?.coordinates?.[1] ??
        (item.lat != null ? Number(item.lat) : null),

    lng:
        item.geom?.coordinates?.[0] ??
        (item.lng != null ? Number(item.lng) : null),

    chu_so_huu:
        typeof item.chu_so_huu === "string"
            ? JSON.parse(item.chu_so_huu)
            : item.chu_so_huu || []
});

// ================= FORMAT LIST =================
const formatListResponse = (res) => {
    const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
            ? res.data
            : [];

    return list.map(normalizeCongTrinh);
};

// ================= BUILD QUERY =================
const buildQuery = (filters = {}) => {
    const clean = {};

    Object.keys(filters).forEach((key) => {
        const value = filters[key];

        if (value !== undefined && value !== null && value !== "") {
            clean[key] = value;
        }
    });

    return new URLSearchParams(clean).toString();
};

// ================= GET ALL =================
export const getCongTrinh = async () => {
    const res = await fetch(API_URL);
    const data = await handleResponse(res);
    return formatListResponse(data);
};

// ================= SEARCH =================
export const searchCongTrinh = async (filters = {}) => {
    const query = buildQuery(filters);

    const res = await fetch(`${API_URL}/search?${query}`);
    const data = await handleResponse(res);

    return formatListResponse(data);
};

// ================= SEARCH BY CCCD =================
export const searchCongTrinhByCCCD = async (cccd) => {
    const res = await fetch(`${API_URL}/cccd/${cccd}`);
    const data = await handleResponse(res);

    return formatListResponse(data);
};

// ================= SEARCH BY MAP =================
export const searchCongTrinhByMap = async (lat, lng) => {
    const query = buildQuery({ lat, lng });

    const res = await fetch(`${API_URL}/map?${query}`);
    const data = await handleResponse(res);

    return formatListResponse(data);
};

// ================= GET BY ID =================
export const getCongTrinhById = async (id) => {
    const res = await fetch(`${API_URL}/${id}`);
    const data = await handleResponse(res);

    return normalizeCongTrinh(data?.data || data);
};

// ================= CREATE =================
export const createCongTrinh = async (payload) => {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    return handleResponse(res);
};

// ================= UPDATE =================
export const updateCongTrinh = async (id, payload) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    return handleResponse(res);
};

// ================= DELETE =================
export const deleteCongTrinh = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    return handleResponse(res);
};