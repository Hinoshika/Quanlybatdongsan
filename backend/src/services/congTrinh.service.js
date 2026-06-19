const CongTrinhModel = require("../models/congTrinh.model");
const SoHuuCongTrinhModel = require("../models/soHuuCongTrinh.model");
const LichSuChinhSuaService = require("../services/lichSuChinhSua.service");

const parseGeom = (geom) => {
  if (!geom) return null;

  try {
    return typeof geom === "string" ? JSON.parse(geom) : geom;
  } catch (err) {
    return null;
  }
};

const normalizeData = (item) => ({
  ...item,

  geom: parseGeom(item.geom),

  lat: item.lat != null ? Number(item.lat) : null,

  lng: item.lng != null ? Number(item.lng) : null,

  chu_so_huu: Array.isArray(item.chu_so_huu) ? item.chu_so_huu : [],
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

    const data = await CongTrinhModel.searchByCCCD(so_cccd.trim());

    return data.map(normalizeData);
  },

  // ================= SEARCH BY MAP =================
  searchByMap: async (lat, lng) => {
    if (lat == null || lng == null) {
      throw new Error("Thiếu tọa độ");
    }

    const data = await CongTrinhModel.searchByMap(Number(lat), Number(lng));

    return data.map(normalizeData);
  },

  // ================= CREATE =================
  create: async (data, user) => {
    if (!data.ten_cong_trinh?.trim()) {
      throw new Error("Thiếu tên công trình");
    }

    if (!data.thua_dat_id) {
      throw new Error("Thiếu thửa đất");
    }

    // tách owners
    const { owners = [], ...congTrinhData } = data;

    const payload = {
      ...congTrinhData,
    };

    // lat/lng -> geom
    if (payload.lat != null && payload.lng != null) {
      payload.geom = {
        type: "Point",
        coordinates: [Number(payload.lng), Number(payload.lat)],
      };
    }

    // tạo công trình
    const created = await CongTrinhModel.create(payload);

    // ================= LƯU CHỦ SỞ HỮU =================

    if (owners.length > 0) {
      for (const owner of owners) {
        await SoHuuCongTrinhModel.create({
          cong_trinh_id: created.id,

          chu_so_huu_id: owner.chu_so_huu_id,

          ty_le_so_huu: owner.ty_le_so_huu || 100,
        });
      }
    }

    await LichSuChinhSuaService.log({
      user: user || { id: 1 },

      action: "CREATE",

      object: "CONG_TRINH",

      objectId: created.id,

      oldData: null,

      newData: created,

      reason: "Tạo công trình mới",
    });

    return created;
  },

  // ================= UPDATE =================
  update: async (id, data) => {
    if (!id) {
      throw new Error("Thiếu ID công trình");
    }

    const old = await CongTrinhModel.getById(id);

    if (!old) {
      throw new Error("Không tìm thấy công trình");
    }

    const payload = {
      ...old,
      ...data,
    };

    if (payload.lat != null && payload.lng != null) {
      payload.geom = {
        type: "Point",

        coordinates: [Number(payload.lng), Number(payload.lat)],
      };
    }

    return await CongTrinhModel.update(id, payload);
  },

  // ================= DELETE =================
  delete: async (id, user) => {
    if (!id) {
      throw new Error("Thiếu ID công trình");
    }

    // Lấy dữ liệu trước khi phá dỡ
    const oldData = await CongTrinhModel.getById(id);

    if (!oldData) {
      throw new Error("Không tìm thấy công trình");
    }

    // Thực hiện phá dỡ (soft delete)
    const result = await CongTrinhModel.delete(id);

    // Ghi lịch sử
    await LichSuChinhSuaService.log({
      user: user || { id: 1 },

      action: "DELETE",

      object: "CONG_TRINH",

      objectId: id,

      oldData: oldData,

      newData: {
        ...oldData,
        trang_thai: "Đã phá dỡ",
        deleted_at: new Date(),
      },

      reason: "Phá dỡ công trình",
    });

    return result;
  },
};

module.exports = CongTrinhService;
