const API_URL = "http://localhost:5000/api/thua-dat-map";

const handleResponse = async (res) => {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API Error");
  }

  return data;
};

// GET ALL
export const getAllThuaDatMap = async () => {
  const res = await fetch(API_URL);

  const data = await handleResponse(res);

  console.log("API THUA DAT MAP:", data);

  return data.data;
};

// GET BY THUA DAT
export const getThuaDatMapByThuaDat = async (thuaDatId) => {
  const res = await fetch(`${API_URL}/thua-dat/${thuaDatId}`);

  const data = await handleResponse(res);

  return data.data;
};

// CREATE
export const createThuaDatMap = async (payload) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await handleResponse(res);

  return data.data;
};

// UPDATE
export const updateThuaDatMap = async (id, payload) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await handleResponse(res);

  return data.data;
};

// DELETE
export const deleteThuaDatMap = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  const data = await handleResponse(res);

  return data.data;
};
