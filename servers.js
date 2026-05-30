const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());

// Lấy dữ liệu point từ OSM
app.get("/ho-tay", async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                osm_id,
                name,
                ST_AsGeoJSON(ST_Transform(way, 4326)) AS geojson
            FROM planet_osm_polygon
            WHERE osm_id = 9635863
        `);

        res.json(result.rows[0]);

    } catch (err) {
        console.log(err);
        res.status(500).send("Lỗi server");
    }
});
app.listen(4000, () => {
    console.log("Server running at http://localhost:4000");
});
app.use(express.static("public"));