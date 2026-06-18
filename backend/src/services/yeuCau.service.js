const YeuCauModel = require("../models/yeuCau.model");
const LichSuChinhSuaService = require("../services/lichSuChinhSua.service");

const YeuCauService = {
  // ================= GET ALL =================

  getAll: async () => {
    return await YeuCauModel.getAll();
  },

  // ================= GET BY ID =================

  getById: async (id) => {
    return await YeuCauModel.getById(id);
  },

  // ================= CREATE =================

  create: async (data, user) => {
    const created = await YeuCauModel.create(data);

    await LichSuChinhSuaService.log({
      user: user || {
        id: 1,
      },

      action: "CREATE",

      object: "YEU_CAU",

      objectId: created.id,

      newData: created,

      reason: "Tạo yêu cầu mới",
    });

    return created;
  },

  // ================= UPDATE =================

  update: async (id, data, user) => {
    const old = await YeuCauModel.getById(id);

    if (!old) {
      throw new Error("Không tìm thấy yêu cầu");
    }

    const updated = await YeuCauModel.update(id, data);

    await LichSuChinhSuaService.log({
      user: user || {
        id: 1,
      },

      action: "UPDATE",

      object: "YEU_CAU",

      objectId: id,

      oldData: old,

      newData: updated,

      reason: `
                Cập nhật trạng thái:
                ${old.trang_thai}
                -> 
                ${updated.trang_thai}
                `,
    });

    return updated;
  },

  // ================= DELETE =================

  remove: async (id, user) => {
    const old = await YeuCauModel.getById(id);

    if (!old) {
      throw new Error("Không tìm thấy yêu cầu");
    }

    const result = await YeuCauModel.remove(id);

    await LichSuChinhSuaService.log({
      user: user || {
        id: 1,
      },

      action: "DELETE",

      object: "YEU_CAU",

      objectId: id,

      oldData: old,

      reason: "Xóa yêu cầu",
    });

    return result;
  },
};

module.exports = YeuCauService;
