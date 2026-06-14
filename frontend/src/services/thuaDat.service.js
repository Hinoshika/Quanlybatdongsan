const API_URL = "http://localhost:5000/api/thua-dat";

const API_CHU_SO_HUU =
    "http://localhost:5000/api/chu-so-huu";

const API_CONG_TRINH =
    "http://localhost:5000/api/cong-trinh";

// ================= HANDLE RESPONSE =================
const handleResponse = async (res) => {

    const data = await res.json();

    if (!res.ok) {

        throw new Error(
            data.message || "API Error"
        );
    }

    return data;
};

// ================= NORMALIZE =================
const normalizeThuaDat = (item) => ({

    ...item,

    geom: (() => {
        const g = item.geom;

        if (!g) return null;

        if (typeof g === "object") return g;

        if (typeof g !== "string") return null;

        // 🔥 CHẶN TRƯỜNG HỢP NUMBER STRING
        if (!isNaN(g)) return null;

        try {
            return JSON.parse(g);
        } catch (e) {
            return null;
        }
    })(),

    lat: item.lat != null ? Number(item.lat) : null,
    lng: item.lng != null ? Number(item.lng) : null,

    chu_so_huu: (() => {
        const c = item.chu_so_huu;

        if (!c) return [];

        if (typeof c === "object") return c;

        try {
            return JSON.parse(c);
        } catch {
            return [];
        }
    })()
});

// ================= FORMAT RESPONSE =================
const formatListResponse = (res) => {

    // CASE 1:
    // { total, data: [] }

    if (Array.isArray(res.data)) {

        return res.data.map(
            normalizeThuaDat
        );
    }

    // CASE 2:
    // []

    if (Array.isArray(res)) {

        return res.map(
            normalizeThuaDat
        );
    }

    return [];
};

// ================= GET ALL / SEARCH =================
export const getThuaDat = async (
    params = {}
) => {

    const cleanParams =
        Object.fromEntries(

            Object.entries(params).filter(
                ([_, v]) =>
                    v !== null &&
                    v !== undefined &&
                    v !== ""
            )
        );

    const query =
        new URLSearchParams(
            cleanParams
        ).toString();

    const url =
        query
            ? `${API_URL}/search?${query}`
            : API_URL;

    const res = await fetch(url);

    const data =
        await handleResponse(res);

    return formatListResponse(data);
};

// ================= GET BY ID =================
export const getThuaDatById = async (
    id
) => {

    const res = await fetch(
        `${API_URL}/${id}`
    );

    const data =
        await handleResponse(res);

    return normalizeThuaDat(
        data.data || data
    );
};

// ================= SEARCH BY CCCD =================
export const searchByCCCD = async (cccd) => {

    const res = await fetch(
        `${API_URL}/cccd/${cccd}`
    );

    const data = await handleResponse(res);

    return formatListResponse(data);
};

// ================= SEARCH BY MAP =================
export const searchByMap = async (
    lat,
    lng
) => {

    const res = await fetch(
        `${API_URL}/search/map?lat=${lat}&lng=${lng}`
    );

    const data =
        await handleResponse(res);

    return formatListResponse(data);
};

// ================= GET CHỦ SỞ HỮU =================
export const getChuSoHuuByCCCD = async (cccd) => {
    const res = await fetch(
        `${API_CHU_SO_HUU}/cccd/${cccd}`
    );

    const data = await handleResponse(res);

    return data.data || data;   // 🔥 FIX QUAN TRỌNG
};
// ================= CREATE =================
export const createThuaDat = async (
    data
) => {

    const res = await fetch(
        API_URL,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify(data),
        }
    );

    return handleResponse(res);
};

// ================= UPDATE =================
export const updateThuaDat = async (
    id,
    data
) => {

    const res = await fetch(
        `${API_URL}/${id}`,
        {
            method: "PUT",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify(data),
        }
    );

    return handleResponse(res);
};

// ================= DELETE =================
export const deleteThuaDat = async (
    id
) => {

    const res = await fetch(
        `${API_URL}/${id}`,
        {
            method: "DELETE",
        }
    );

    return handleResponse(res);
};

// ================= CREATE CÔNG TRÌNH =================
export const createCongTrinh =
    async (data) => {

        const res = await fetch(
            API_CONG_TRINH,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify(data)
            }
        );

        return handleResponse(res);
    };

// ================= SEARCH BY ADDRESS =================
export const searchByAddress = async (address) => {

    const res = await fetch(
        `${API_URL}/search/address?q=${encodeURIComponent(address)}`
    );

    const data = await handleResponse(res);

    return formatListResponse(data);
};

// ================= GỘP THỬA =================
export const mergeThuaDat = async (payload) => {

    if (!payload?.thua_ids || payload.thua_ids.length < 2) {
        throw new Error("Phải chọn ít nhất 2 thửa để gộp");
    }

    const res = await fetch(`${API_URL}/merge`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
    });

    const data = await handleResponse(res);

    return {
        ...data,
        data: data?.data ? normalizeThuaDat(data.data) : null
    };

};
export const tachThuaDat = async (payload) => {

    const res = await fetch(
        `${API_URL}/tach`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        }
    );

    return handleResponse(res);
};