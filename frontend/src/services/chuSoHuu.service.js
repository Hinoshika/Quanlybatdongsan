import axios from "axios";

const API = "http://localhost:5000/api/chu-so-huu";

export const getChuSoHuu = () => axios.get(API);
export const getChuSoHuuById = (id) => axios.get(`${API}/${id}`);
export const createChuSoHuu = (data) => axios.post(API, data);
export const updateChuSoHuu = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteChuSoHuu = (id) => axios.delete(`${API}/${id}`);
export const getTaiSanByChuSoHuuId = (id) => axios.get(`${API}/${id}/tai-san`);
export const getChuSoHuuByCCCD = (cccd) => axios.get(`${API}/cccd/${cccd}`);