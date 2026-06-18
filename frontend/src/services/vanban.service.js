const API_URL = "http://localhost:5000/api/van-ban";

// ================= HANDLE RESPONSE =================

const handleResponse = async (res) => {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API Error");
  }

  return data;
};

// ================= TẠO VĂN BẢN DOCX =================

export const taoVanBan = async (yeuCauId) => {
  if (!yeuCauId) {
    throw new Error("Không có mã yêu cầu");
  }

  const res = await fetch(
    `${API_URL}/yeu-cau/${yeuCauId}`,

    {
      method: "GET",
    },
  );

  return handleResponse(res);
};
