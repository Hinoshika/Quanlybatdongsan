import axiosClient from "./axiosClient";

// tìm theo CCCD
export const searchByCccdApi = (cccd) => {
    return axiosClient.get(`/search/cccd/${cccd}`);
};

// tìm theo tọa độ map
export const searchByMapApi = (lat, lng) => {
    return axiosClient.get(`/search/map?lat=${lat}&lng=${lng}`);
};

// lấy chi tiết thửa đất
export const getThuaDetailApi = (id) => {
    return axiosClient.get(`/thua-dat/${id}`);
};