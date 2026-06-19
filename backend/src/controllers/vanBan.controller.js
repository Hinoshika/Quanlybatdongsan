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

      const today = new Date();

      const noiDungTraLoi = `
Sau khi tiếp nhận và xem xét yêu cầu của Ông/Bà ${yeuCau.nguoi_gui},
cơ quan quản lý đã tiến hành kiểm tra, đối chiếu thông tin với dữ liệu đang được quản lý trong hệ thống.

Kết quả kiểm tra cho thấy các thông tin liên quan đến hồ sơ yêu cầu đã được xác nhận và xử lý theo đúng quy định hiện hành.

Yêu cầu của Ông/Bà đã được giải quyết thành công. Các thông tin liên quan đã được cập nhật vào cơ sở dữ liệu quản lý đất đai và lưu trữ trong hệ thống.

Trường hợp cần bổ sung thông tin hoặc có ý kiến phản hồi khác, đề nghị Ông/Bà liên hệ cơ quan tiếp nhận để được hướng dẫn và hỗ trợ.

Xin trân trọng thông báo.
`;

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
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `Ngày ${today.getDate()} tháng ${
                      today.getMonth() + 1
                    } năm ${today.getFullYear()}`,
                    italics: true,
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
                    bold: true,
                    size: 24,
                  }),
                ],
              }),

              new Paragraph(""),

              new Paragraph({
                children: [
                  new TextRun({
                    text: `Nội dung yêu cầu: ${
                      yeuCau.noi_dung || "Không có nội dung"
                    }`,
                    size: 24,
                  }),
                ],
              }),

              new Paragraph(""),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "Căn cứ hồ sơ tiếp nhận, cơ quan xử lý trả lời như sau:",
                    bold: true,
                    size: 24,
                  }),
                ],
              }),

              new Paragraph(""),

              new Paragraph({
                children: [
                  new TextRun({
                    text: noiDungTraLoi,
                    size: 24,
                  }),
                ],
              }),

              new Paragraph(""),
              new Paragraph(""),

              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: "TM. CƠ QUAN GIẢI QUYẾT",
                    bold: true,
                    size: 24,
                  }),
                ],
              }),

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

              new Paragraph(""),
              new Paragraph(""),
              new Paragraph(""),
              new Paragraph(""),

              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: "(Ký và ghi rõ họ tên)",
                    italics: true,
                    size: 22,
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
        fs.mkdirSync(folder, { recursive: true });
      }

      const filename = `van-ban-${id}-${Date.now()}.docx`;

      const filepath = path.join(folder, filename);

      fs.writeFileSync(filepath, buffer);

      res.json({
        success: true,
        message: "Tạo văn bản thành công",
        url: `uploads/van-ban/${filename}`,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = VanBanController;
