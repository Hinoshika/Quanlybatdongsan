const API_URL = "http://localhost:5000/api/yeu-cau";

// ================= TOKEN =================

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

// ================= HANDLE RESPONSE =================

const handleResponse = async (res) => {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API Error");
  }

  return data;
};

// ================= GET ALL =================

export const getYeuCau = async () => {
  const res = await fetch(API_URL, {
    headers: getAuthHeader(),
  });

  return handleResponse(res);
};

// ================= GET MY REQUEST =================

export const getMyYeuCau = async () => {
  const res = await fetch(`${API_URL}/my`, {
    headers: getAuthHeader(),
  });

  return handleResponse(res);
};

// ================= GET BY ID =================

export const getYeuCauById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });

  return handleResponse(res);
};

// ================= CREATE =================

export const createYeuCau = async (formData) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeader(),
    body: formData,
  });

  return handleResponse(res);
};

// ================= UPDATE =================

export const updateYeuCau = async (id, formData) => {
  if (!id) {
    throw new Error("Invalid request id");
  }

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: formData,
  });

  return handleResponse(res);
};

// ================= DELETE =================

export const deleteYeuCau = async (id) => {
  if (!id) {
    throw new Error("Invalid request id");
  }

  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  return handleResponse(res);
};

// ================= APPROVE =================

export const approveYeuCau = async (id, ghi_chu_xu_ly = "") => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",

    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      trang_thai: "HOAN_THANH",
      ghi_chu_xu_ly,
    }),
  });

  return handleResponse(res);
};

// ================= REJECT =================

export const rejectYeuCau = async (id, ghi_chu_xu_ly = "") => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",

    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      trang_thai: "TU_CHOI",
      ghi_chu_xu_ly,
    }),
  });

  return handleResponse(res);
};
