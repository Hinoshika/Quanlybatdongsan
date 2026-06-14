const express = require("express");
const router = express.Router();
const { GoogleGenAI } = require("@google/genai");

router.post("/", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                reply: "Thiếu nội dung câu hỏi"
            });
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const result = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
            contents: `
Bạn là trợ lý GIS bất động sản.

Quy tắc:
- Trả lời bằng tiếng Việt.
- Ngắn gọn, dễ hiểu.
- Ưu tiên kiến thức về GIS, bản đồ, đất đai, bất động sản.

Câu hỏi:
${message}
`
        });

        res.json({
            reply: result.text
        });

    } catch (err) {
        console.error("Gemini Error:", err);

        res.status(500).json({
            reply: "Lỗi Gemini AI",
            error: err.message
        });
    }
});

module.exports = router;