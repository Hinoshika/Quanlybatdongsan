const API_URL = "http://localhost:5000/api/yeu-cau";

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

// ================= GET ALL =================
export const getYeuCau = async () => {
    const res = await fetch(API_URL);

    return handleResponse(res);
};

// ================= GET BY ID =================
export const getYeuCauById = async (id) => {
    const res = await fetch(
        `${API_URL}/${id}`
    );

    return handleResponse(res);
};

// ================= CREATE =================
export const createYeuCau = async (
    formData
) => {
    const res = await fetch(
        API_URL,
        {
            method: "POST",
            body: formData
        }
    );

    return handleResponse(res);
};

// ================= UPDATE =================
export const updateYeuCau = async (
    id,
    data
) => {
    if (!id) {
        throw new Error(
            "Invalid request id"
        );
    }

    const res = await fetch(
        `${API_URL}/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type":
                    "application/json"
            },
            body: JSON.stringify(data)
        }
    );

    return handleResponse(res);
};

// ================= DELETE =================
export const deleteYeuCau = async (
    id
) => {
    if (!id) {
        throw new Error(
            "Invalid request id"
        );
    }

    const res = await fetch(
        `${API_URL}/${id}`,
        {
            method: "DELETE"
        }
    );

    return handleResponse(res);
};

// ================= APPROVE =================
export const approveYeuCau =
    async (
        id,
        ghi_chu_xu_ly = ""
    ) => {
        const res = await fetch(
            `${API_URL}/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    trang_thai:
                        "DA_DUYET",
                    ghi_chu_xu_ly
                })
            }
        );

        return handleResponse(res);
    };

// ================= REJECT =================
export const rejectYeuCau =
    async (
        id,
        ghi_chu_xu_ly = ""
    ) => {
        const res = await fetch(
            `${API_URL}/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    trang_thai:
                        "TU_CHOI",
                    ghi_chu_xu_ly
                })
            }
        );

        return handleResponse(res);
    };