const CongTrinhModel = require("../models/congTrinh.model");

const parseGeom = (geom) => {

    if (!geom) return null;

    try {

        return typeof geom === "string"
            ? JSON.parse(geom)
            : geom;

    } catch (err) {

        return null;
    }
};

const normalizeData = (item) => ({

    ...item,

    geom: parseGeom(item.geom),

    lat:
        item.lat != null
            ? Number(item.lat)
            : null,

    lng:
        item.lng != null
            ? Number(item.lng)
            : null,

    chu_so_huu:
        Array.isArray(item.chu_so_huu)
            ? item.chu_so_huu
            : []
});

const CongTrinhService = {

    // ================= GET ALL =================
    getAll: async () => {

        const data = await CongTrinhModel.getAll();

        return data.map(normalizeData);
    },

    // ================= GET BY ID =================
    getById: async (id) => {

        if (!id) {
            throw new Error("Thiếu ID công trình");
        }

        const data = await CongTrinhModel.getById(id);

        if (!data) {
            throw new Error("Không tìm thấy công trình");
        }

        return normalizeData(data);
    },

    // ================= SEARCH =================
    search: async (filters) => {

        const data = await CongTrinhModel.search(filters);

        return data.map(normalizeData);
    },

    // ================= SEARCH BY CCCD =================
    searchByCCCD: async (so_cccd) => {

        if (!so_cccd?.trim()) {
            throw new Error("Thiếu CCCD");
        }

        const data =
            await CongTrinhModel.searchByCCCD(
                so_cccd.trim()
            );

        return data.map(normalizeData);
    },

    // ================= SEARCH BY MAP =================
    searchByMap: async (lat, lng) => {

        if (
            lat == null ||
            lng == null
        ) {
            throw new Error("Thiếu tọa độ");
        }

        const data =
            await CongTrinhModel.searchByMap(
                Number(lat),
                Number(lng)
            );

        return data.map(normalizeData);
    },

    // ================= CREATE =================
    create: async (data) => {

        if (!data.ten_cong_trinh?.trim()) {
            throw new Error("Thiếu tên công trình");
        }

        if (!data.thua_dat_id) {
            throw new Error("Thiếu thửa đất");
        }

        const payload = { ...data };

        // lat/lng -> geom
        if (
            payload.lat != null &&
            payload.lng != null
        ) {

            payload.geom = {
                type: "Point",

                coordinates: [
                    Number(payload.lng),
                    Number(payload.lat)
                ]
            };
        }

        return await CongTrinhModel.create(
            payload
        );
    },

    // ================= UPDATE =================
    update: async (id, data) => {

        if (!id) {
            throw new Error("Thiếu ID công trình");
        }

        const old =
            await CongTrinhModel.getById(id);

        if (!old) {
            throw new Error("Không tìm thấy công trình");
        }

        const payload = {
            ...old,
            ...data
        };

        if (
            payload.lat != null &&
            payload.lng != null
        ) {

            payload.geom = {
                type: "Point",

                coordinates: [
                    Number(payload.lng),
                    Number(payload.lat)
                ]
            };
        }

        return await CongTrinhModel.update(
            id,
            payload
        );
    },

    // ================= DELETE =================
    delete: async (id) => {

        if (!id) {
            throw new Error("Thiếu ID công trình");
        }

        return await CongTrinhModel.delete(id);
    }
};

module.exports = CongTrinhService;