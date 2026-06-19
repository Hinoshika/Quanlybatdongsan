const pool = require("../config/db");

// =========================
// CREATE THỬA ĐẤT
// =========================

exports.create = async (data) => {
  const {
    so_thua,

    so_to_ban_do,

    dia_chi,

    tinh,

    dien_tich,

    loai_dat,

    muc_dich_su_dung,

    hinh_thuc_su_dung,

    thoi_han_su_dung,

    nguon_goc_su_dung,

    trang_thai,

    geometry,
  } = data;

  const sql = `

        INSERT INTO thua_dat

        (

            so_thua,

            so_to_ban_do,

            dia_chi,

            tinh,

            dien_tich,

            loai_dat,

            muc_dich_su_dung,

            hinh_thuc_su_dung,

            thoi_han_su_dung,

            nguon_goc_su_dung,

            trang_thai,

            geom

        )

        VALUES

        (

            $1,

            $2,

            $3,

            $4,

            $5,

            $6,

            $7,

            $8,

            $9,

            $10,

            $11,

            ST_SetSRID(

                ST_GeomFromGeoJSON($12),

                4326

            )

        )

        RETURNING *

    `;

  const result = await pool.query(
    sql,

    [
      so_thua,

      so_to_ban_do,

      dia_chi,

      tinh,

      dien_tich,

      loai_dat,

      muc_dich_su_dung,

      hinh_thuc_su_dung,

      thoi_han_su_dung,

      nguon_goc_su_dung,

      trang_thai || "dang_su_dung",

      JSON.stringify(geometry),
    ],
  );

  return result.rows[0];
};

// =========================
// LẤY TẤT CẢ THỬA ĐẤT
// =========================

exports.getAll = async () => {
  const sql = `

        SELECT
            id,
            so_thua,
            dien_tich,

            ST_AsGeoJSON(geom)::json 
            AS geometry

        FROM thua_dat

        ORDER BY id DESC

    `;

  const result = await pool.query(sql);

  return result.rows;
};

// =========================
// LẤY THEO ID
// =========================

exports.getById = async (id) => {
  const sql = `

        SELECT
            id,
            so_thua,
            dien_tich,

            ST_AsGeoJSON(geom)::json
            AS geometry

        FROM thua_dat

        WHERE id=$1

    `;

  const result = await pool.query(sql, [id]);

  return result.rows[0];
};

// =========================
// UPDATE RANH GIỚI
// =========================

exports.updateGeometry = async (id, geometry) => {
  const sql = `

        UPDATE thua_dat

        SET geom =
        ST_SetSRID(
            ST_GeomFromGeoJSON($1),
            4326
        )

        WHERE id=$2

        RETURNING *

    `;

  const result = await pool.query(sql, [JSON.stringify(geometry), id]);

  return result.rows[0];
};

// =========================
// DELETE
// =========================

exports.remove = async (id) => {
  const sql = `

        DELETE FROM thua_dat

        WHERE id=$1

        RETURNING *

    `;

  const result = await pool.query(sql, [id]);

  return result.rows[0];
};
