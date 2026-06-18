const { Document, Packer, Paragraph, TextRun, AlignmentType } = require("docx");

const YeuCauModel = require("../models/yeuCau.model");

const fs = require("fs");
const path = require("path");

const VanBanController = {
  taoVanBan: async (req, res) => {
    try {
      const id = req.params.id;

      const yeuCau = await YeuCauModel.getById(id);

      if (!yeuCau) {
        return res.status(404).json({
          message: "Không tìm thấy yêu cầu",
        });
      }

      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,

                children: [
                  new TextRun({
                    text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",

                    bold: true,

                    size: 28,
                  }),
                ],
              }),

              new Paragraph({
                alignment: AlignmentType.CENTER,

                children: [
                  new TextRun({
                    text: "Độc lập - Tự do - Hạnh phúc",

                    bold: true,

                    size: 24,
                  }),
                ],
              }),

              new Paragraph(""),

              new Paragraph({
                alignment: AlignmentType.CENTER,

                children: [
                  new TextRun({
                    text: "VĂN BẢN TRẢ LỜI YÊU CẦU",

                    bold: true,

                    size: 32,
                  }),
                ],
              }),

              new Paragraph(""),

              new Paragraph({
                children: [
                  new TextRun({
                    text: `Kính gửi: ${yeuCau.nguoi_gui}`,

                    size: 24,
                  }),
                ],
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: `Nội dung yêu cầu: ${yeuCau.noi_dung || ""}`,

                    size: 24,
                  }),
                ],
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "Căn cứ hồ sơ tiếp nhận, cơ quan xử lý trả lời như sau:",

                    size: 24,
                  }),
                ],
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "................................................",

                    size: 24,
                  }),
                ],
              }),

              new Paragraph(""),

              new Paragraph({
                alignment: AlignmentType.RIGHT,

                children: [
                  new TextRun({
                    text: "CÁN BỘ XỬ LÝ",

                    bold: true,

                    size: 24,
                  }),
                ],
              }),
            ],
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);

      const folder = path.join(__dirname, "../../uploads/van-ban");

      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, {
          recursive: true,
        });
      }

      const filename = `van-ban-${id}-${Date.now()}.docx`;

      const filepath = path.join(folder, filename);

      fs.writeFileSync(filepath, buffer);

      res.json({
        message: "Tạo văn bản thành công",

        url: `uploads/van-ban/${filename}`,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  },
};

module.exports = VanBanController;
