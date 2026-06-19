const ThuaDatMapModel = require("../models/thuadatmap.model");

const ThuaDatMapService = {
  getAll: async () => {
    return await ThuaDatMapModel.getAll();
  },

  getByThuaDatId: async (thuaDatId) => {
    return await ThuaDatMapModel.getByThuaDatId(thuaDatId);
  },

  create: async (data) => {
    return await ThuaDatMapModel.create(data);
  },

  update: async (id, data) => {
    return await ThuaDatMapModel.update(id, data);
  },

  remove: async (id) => {
    return await ThuaDatMapModel.remove(id);
  },

  // =====================================
  // THÊM CHỦ SỞ HỮU TEST
  // =====================================

  addChuSoHuu: async (data) => {
    return await ThuaDatMapModel.addChuSoHuu(data);
  },
};

module.exports = ThuaDatMapService;
