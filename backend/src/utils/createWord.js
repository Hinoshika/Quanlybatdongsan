const { Document, Paragraph, TextRun, Packer, AlignmentType } = require("docx");

const fs = require("fs");

const createWord = async (data) => {
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

                size: 26,
              }),
            ],
          }),

          new Paragraph(""),

          new Paragraph({
            alignment: AlignmentType.CENTER,

            children: [
              new TextRun({
                text: "VĂN BẢN PHẢN HỒI YÊU CẦU",

                bold: true,

                size: 32,
              }),
            ],
          }),

          new Paragraph(""),

          new Paragraph({
            children: [
              new TextRun({
                text: "Kính gửi: " + data.nguoi_gui,

                bold: true,
              }),
            ],
          }),

          new Paragraph(""),

          new Paragraph(data.noi_dung),

          new Paragraph(""),

          new Paragraph("Ngày lập: " + new Date().toLocaleDateString("vi-VN")),

          new Paragraph(""),

          new Paragraph({
            alignment: AlignmentType.RIGHT,

            children: [
              new TextRun({
                text: "CÁN BỘ XỬ LÝ",

                bold: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  const filename = `uploads/yeu-cau/van-ban-${Date.now()}.docx`;

  fs.writeFileSync(filename, buffer);

  return filename.replace(/\\/g, "/");
};

module.exports = createWord;
