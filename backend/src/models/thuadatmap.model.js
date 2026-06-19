const db = require("../config/db");

const ThuaDatMapModel = {
  // ================= GET ALL MAP =================

  getAll: async () => {
    const sql = `

            SELECT

                td.*,

                ST_AsGeoJSON(td.geom)::json AS geom


            FROM thua_dat td


            WHERE td.deleted_at IS NULL
            AND td.geom IS NOT NULL


            ORDER BY td.id DESC

        `;

    const result = await db.query(sql);

    return result.rows;
  },

  // ================= GET DETAIL =================

  getByThuaDatId: async (id) => {
    const sql = `
        SELECT

            -- BẮC
            json_build_object(
                'id', bac.id,
                'so_thua', bac.so_thua,
                'so_to_ban_do', bac.so_to_ban_do,
                'dia_chi', bac.dia_chi,
                'tinh', bac.tinh,
                'dien_tich', bac.dien_tich,
                'loai_dat', bac.loai_dat,
                'muc_dich_su_dung', bac.muc_dich_su_dung,
                'trang_thai', bac.trang_thai
            ) AS bac,


            -- NAM
            json_build_object(
                'id', nam.id,
                'so_thua', nam.so_thua,
                'so_to_ban_do', nam.so_to_ban_do,
                'dia_chi', nam.dia_chi,
                'tinh', nam.tinh,
                'dien_tich', nam.dien_tich,
                'loai_dat', nam.loai_dat,
                'muc_dich_su_dung', nam.muc_dich_su_dung,
                'trang_thai', nam.trang_thai
            ) AS nam,


            -- ĐÔNG
            json_build_object(
                'id', dong.id,
                'so_thua', dong.so_thua,
                'so_to_ban_do', dong.so_to_ban_do,
                'dia_chi', dong.dia_chi,
                'tinh', dong.tinh,
                'dien_tich', dong.dien_tich,
                'loai_dat', dong.loai_dat,
                'muc_dich_su_dung', dong.muc_dich_su_dung,
                'trang_thai', dong.trang_thai
            ) AS dong,


            -- TÂY
            json_build_object(
                'id', tay.id,
                'so_thua', tay.so_thua,
                'so_to_ban_do', tay.so_to_ban_do,
                'dia_chi', tay.dia_chi,
                'tinh', tay.tinh,
                'dien_tich', tay.dien_tich,
                'loai_dat', tay.loai_dat,
                'muc_dich_su_dung', tay.muc_dich_su_dung,
                'trang_thai', tay.trang_thai
            ) AS tay


        FROM thua_dat td


        -- BẮC
        LEFT JOIN thua_dat bac
        ON bac.id <> td.id
        AND bac.geom IS NOT NULL
        AND ST_IsValid(bac.geom)
        AND ST_Touches(td.geom, bac.geom)
        AND ST_YMax(bac.geom) > ST_YMax(td.geom)



        -- NAM
        LEFT JOIN thua_dat nam
        ON nam.id <> td.id
        AND nam.geom IS NOT NULL
        AND ST_IsValid(nam.geom)
        AND ST_Touches(td.geom, nam.geom)
        AND ST_YMin(nam.geom) < ST_YMin(td.geom)



        -- ĐÔNG
        LEFT JOIN thua_dat dong
        ON dong.id <> td.id
        AND dong.geom IS NOT NULL
        AND ST_IsValid(dong.geom)
        AND ST_Touches(td.geom, dong.geom)
        AND ST_XMax(dong.geom) > ST_XMax(td.geom)



        -- TÂY
        LEFT JOIN thua_dat tay
        ON tay.id <> td.id
        AND tay.geom IS NOT NULL
        AND ST_IsValid(tay.geom)
        AND ST_Touches(td.geom, tay.geom)
        AND ST_XMin(tay.geom) < ST_XMin(td.geom)



        WHERE td.id=$1
        AND td.geom IS NOT NULL
        AND ST_IsValid(td.geom)
    `;

    const result = await db.query(sql, [id]);

    return result.rows[0];
  },
};

module.exports = ThuaDatMapModel;
