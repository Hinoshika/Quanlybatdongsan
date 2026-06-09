const ThuaDatModel = require("../models/thuaDat.model");

const safeGeom = (geom) => {
    if (!geom) return null;
    if (typeof geom === "string") {
        try {
            return JSON.parse(geom);
        } catch {
            return null;
        }
    }
    return geom;
};

const format = (item) => ({
    ...item,
    geom: safeGeom(item.geom),
    lat: item.lat ? Number(item.lat) : null,
    lng: item.lng ? Number(item.lng) : null,
    chu_so_huu: item.chu_so_huu || []
});

const ThuaDatService = {

    getAll: async () => {
        const data = await ThuaDatModel.getAll();
        return data.map(format);
    },

    getById: async (id) => {
        const data = await ThuaDatModel.getById(id);
        return format(data);
    },

    create: async (data) => {

        if (data.polygon?.length >= 3) {

            const overlaps =
                await ThuaDatModel.checkOverlap(
                    data.polygon
                );

            if (overlaps.length > 0) {

                const ds = overlaps
                    .map(x =>
                        `Thửa ${x.so_thua}/Tờ ${x.so_to_ban_do}`
                    )
                    .join(", ");

                const error = new Error(
                    `Tọa độ bị chồng lấn với thửa đất: ${ds}`
                );

                error.status = 400;

                throw error;
            }
        }

        return await ThuaDatModel.create(data);
    },

    update: async (id, data) => {
        const old = await ThuaDatModel.getById(id);
        const payload = { ...old, ...data };
        return ThuaDatModel.update(id, payload);
    },

    delete: async (id) => {
        return ThuaDatModel.delete(id);
    },

    search: async (query) => {
        const data = await ThuaDatModel.search(query);
        return data.map(format);
    },

    searchByCCCD: async (so_cccd) => {
        if (!so_cccd) throw new Error("Thiếu CCCD");
        const data = await ThuaDatModel.searchByCCCD(so_cccd);
        return data.map(format);
    },

    // ==================== TÌM THEO BẢN ĐỒ (MỚI THÊM) ====================
    searchByMap: async (lat, lng, radius = 500) => {
        if (!lat || !lng) {
            throw new Error("Thiếu tọa độ lat hoặc lng");
        }

        const data = await ThuaDatModel.searchByMap(lat, lng, radius);
        return data.map(format);
    }
};

module.exports = ThuaDatService;