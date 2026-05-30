const API_URL = "http://localhost:5000/api/users";

// ================= HANDLE RESPONSE =================
const handleResponse = async (res) => {
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "API Error");
    }

    return data;
};

// ================= AUTH HEADER =================
const authHeader = () => {
    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : ""
    };
};

// ================= GET ALL =================
export const getUsers = async () => {
    const res = await fetch(API_URL, {
        headers: authHeader()
    });

    return handleResponse(res);
};

// ================= CREATE =================
export const createUser = async (data) => {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(data)
    });

    return handleResponse(res);
};

// ================= UPDATE =================
export const updateUser = async (id, data) => {

    if (!id) {
        throw new Error("Invalid user id");
    }

    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify(data)
    });

    return handleResponse(res);
};

// ================= DELETE =================
export const deleteUser = async (id) => {

    if (!id) {
        throw new Error("Invalid user id");
    }

    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: authHeader()
    });

    return handleResponse(res);
};