const ThuaDatModel = require("../models/thuaDat.model");
const LichSuChinhSuaService = require("../services/lichSuChinhSua.service");

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

    create: async (data, user) => {


        // ================= CHECK POLYGON =================

        if (
            !Array.isArray(data.polygon) ||
            data.polygon.length < 3
        ) {

            const error = new Error(
                "Polygon phải có ít nhất 3 điểm tọa độ"
            );

            error.status = 400;
            throw error;
        }



        // ================= CHECK TỪNG ĐIỂM =================

        for (const point of data.polygon) {


            if (
                !Array.isArray(point) ||
                point.length !== 2
            ) {

                const error = new Error(
                    "Tọa độ polygon không đúng định dạng"
                );

                error.status = 400;
                throw error;
            }



            const [lat, lng] = point;



            if (
                isNaN(lat) ||
                isNaN(lng)
            ) {

                const error = new Error(
                    "Vĩ độ và kinh độ phải là số"
                );

                error.status = 400;
                throw error;
            }



            // kiểm tra latitude

            if (
                Number(lat) < -90 || Number(lat) > 90 || Number(lng) < -180 || Number(lng) > 180
            ) {

                const error = new Error(
                    `Tọa độ không hợp lệ`
                );

                error.status = 400;
                throw error;
            }

        }
        // ================= CHECK ĐIỂM ĐẦU CUỐI =================

        const first =
            data.polygon[0];

        const last =
            data.polygon[data.polygon.length - 1];


        if (
            first[0] !== last[0] ||
            first[1] !== last[1]
        ) {

            data.polygon.push([
                first[0],
                first[1]
            ]);

        }
        // ================= CHECK CHỒNG LẤN =================
        const overlaps =
            await ThuaDatModel.checkOverlap(
                data.polygon
            );
        if (overlaps.length > 0) {
            const ds =
                overlaps
                    .map(
                        x =>
                            `Thửa ${x.so_thua}/Tờ ${x.so_to_ban_do}`
                    )
                    .join(", ");

            const error =
                new Error(
                    `Tọa độ bị chồng lấn với thửa đất: ${ds}`
                );


            error.status = 400;

            throw error;
        }
        // ================= CREATE =================

        const created =
            await ThuaDatModel.create(data);
        // ================= HISTORY =================

        await LichSuChinhSuaService.log({

            user,

            action: "CREATE",

            object: "THUA_DAT",

            objectId: created.id,

            newData: created,

            reason: "Tạo thửa đất mới"

        });

        return created;
    },

    update: async (id, data, user) => {

        const old = await ThuaDatModel.getById(id);
        const payload = { ...old, ...data };

        const updated = await ThuaDatModel.update(id, payload);

        await LichSuChinhSuaService.log({
            user,
            action: "UPDATE",
            object: "THUA_DAT",
            objectId: id,
            oldData: old,
            newData: updated,
            reason: "Cập nhật thửa đất"
        });

        return updated;
    },

    delete: async (id, user) => {

        const old = await ThuaDatModel.getById(id);

        const result = await ThuaDatModel.delete(id);

        await LichSuChinhSuaService.log({
            user,
            action: "DELETE",
            object: "THUA_DAT",
            objectId: id,
            oldData: old,
            reason: "Xóa thửa đất"
        });

        return result;
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
    },

    merge: async (thuaIds, user) => {

        const thuas =
            await ThuaDatModel.getByIds(thuaIds);

        if (thuas.length < 2) {
            throw new Error(
                "Phải chọn ít nhất 2 thửa"
            );
        }

        // cùng tờ bản đồ
        if (
            thuas.some(
                t =>
                    t.so_to_ban_do !==
                    thuas[0].so_to_ban_do
            )
        ) {
            throw new Error(
                "Các thửa phải cùng tờ bản đồ"
            );
        }

        // cùng loại đất
        if (
            thuas.some(
                t =>
                    t.loai_dat !==
                    thuas[0].loai_dat
            )
        ) {
            throw new Error(
                "Các thửa phải cùng loại đất"
            );
        }

        // cùng mục đích sử dụng
        if (
            thuas.some(
                t =>
                    t.muc_dich_su_dung !==
                    thuas[0].muc_dich_su_dung
            )
        ) {
            throw new Error(
                "Các thửa phải cùng mục đích sử dụng"
            );
        }

        // cùng thời hạn sử dụng
        if (
            thuas.some(
                t =>
                    t.thoi_han_su_dung !==
                    thuas[0].thoi_han_su_dung
            )
        ) {
            throw new Error(
                "Các thửa phải cùng thời hạn sử dụng"
            );
        }

        // cùng nguồn gốc sử dụng
        if (
            thuas.some(
                t =>
                    t.nguon_goc_su_dung !==
                    thuas[0].nguon_goc_su_dung
            )
        ) {
            throw new Error(
                "Các thửa phải cùng nguồn gốc sử dụng"
            );
        }

        // cùng hình thức sử dụng
        if (
            thuas.some(
                t =>
                    t.hinh_thuc_su_dung !==
                    "Sử Dụng Riêng"
            )
        ) {
            throw new Error(
                "Chỉ được gộp các thửa sử dụng riêng"
            );
        }

        if (
            thuas.some(
                t =>
                    t.trang_thai !== "Đang sử dụng"
            )
        ) {
            throw new Error(
                "Chỉ được gộp các thửa đang sử dụng"
            );
        }

        // trạng thái
        // const invalid = thuas.find(
        //     t =>
        //         t.trang_thai === "tranh_chap" ||
        //         t.trang_thai === "the_chap" ||
        //         t.trang_thai === "da_gop"
        // );

        // if (invalid) {
        //     throw new Error(
        //         `Thửa ${invalid.so_thua} không đủ điều kiện gộp`
        //     );
        // }

        // liền kề
        const adjacent =
            await ThuaDatModel.checkAdjacent(
                thuaIds
            );

        if (!adjacent) {
            throw new Error(
                "Các thửa được chọn không liền kề nhau"
            );
        }

        const result = await ThuaDatModel.merge(thuaIds);

        // ================= LOG =================
        await LichSuChinhSuaService.log({
            user: user || { id: 1 },
            action: "MERGE",
            object: "THUA_DAT",
            objectId: result?.id || null,
            oldData: thuas,
            newData: result,
            reason: "Gộp thửa đất"
        });

        return result;
    },
    tach: async (payload, user) => {

        const oldThua =
            await ThuaDatModel.getById(
                payload.thua_dat_id
            );

        if (!oldThua) {
            throw new Error("Không tìm thấy thửa đất");
        }

        // ================= RULE 1: trạng thái =================
        if (oldThua.trang_thai !== "Đang sử dụng") {
            throw new Error("Thửa đất không ở trạng thái hợp lệ để tách");
        }

        // ================= RULE 2: hình thức sử dụng =================
        if (
            (oldThua.hinh_thuc_su_dung || "")
                .trim()
                .toLowerCase() !== "sử dụng riêng"
        ) {
            throw new Error(
                "Chỉ được tách thửa có hình thức sử dụng riêng"
            );
        }

        // ================= RULE 3: thửa con =================
        if (
            !payload.thua_con ||
            payload.thua_con.length < 2
        ) {
            throw new Error("Phải có ít nhất 2 thửa con");
        }

        // ================= VALIDATE THỬA CON =================
        for (const thua of payload.thua_con) {

            if (!thua.so_thua_moi) {
                throw new Error("Thiếu số thửa mới");
            }

            if (!thua.dien_tich || Number(thua.dien_tich) <= 0) {
                throw new Error(
                    `Diện tích thửa ${thua.so_thua_moi} không hợp lệ`
                );
            }

            if (
                !Array.isArray(thua.coordinates) ||
                thua.coordinates.length < 3
            ) {
                throw new Error(
                    `Thửa ${thua.so_thua_moi} phải có ít nhất 3 điểm tọa độ`
                );
            }

            // ================= CHECK COORDINATES =================
            for (const point of thua.coordinates) {

                if (!Array.isArray(point) || point.length !== 2) {
                    throw new Error(
                        `Tọa độ thửa ${thua.so_thua_moi} không hợp lệ`
                    );
                }

                const [lng, lat] = point;

                if (isNaN(lng) || isNaN(lat)) {
                    throw new Error(
                        `Tọa độ thửa ${thua.so_thua_moi} phải là số`
                    );
                }

                if (lng < -180 || lng > 180) {
                    throw new Error(`Kinh độ ${lng} không hợp lệ`);
                }

                if (lat < -90 || lat > 90) {
                    throw new Error(`Vĩ độ ${lat} không hợp lệ`);
                }
            }
        }

        // ================= RULE 4: tổng diện tích =================
        const tongDienTich =
            payload.thua_con.reduce(
                (s, x) => s + Number(x.dien_tich || 0),
                0
            );

        if (tongDienTich > Number(oldThua.dien_tich)) {
            throw new Error(
                `Tổng diện tích (${tongDienTich} m²) vượt diện tích thửa gốc (${oldThua.dien_tich} m²)`
            );
        }

        const result = await ThuaDatModel.tach(payload);

        // ================= LOG =================
        await LichSuChinhSuaService.log({
            user: user || { id: 1 },
            action: "TACH",
            object: "THUA_DAT",
            objectId: payload.thua_dat_id,
            oldData: oldThua,
            newData: result,
            reason: "Tách thửa đất"
        });

        return result;
    },
};

module.exports = ThuaDatService;