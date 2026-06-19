// src/models/thuaDatMap.model.js

const db = require("../config/db");

const ThuaDatMapModel = {
  // =====================================================
  // GET ALL MAP
  // =====================================================

  getAll: async () => {
    const sql = `

        SELECT

            td.*,


            ST_AsGeoJSON(td.geom)::json AS geom,



            COALESCE(

                json_agg(

                    json_build_object(

                        'id',
                        csh.id,


                        'ho_ten',
                        csh.ho_ten,


                        'so_cccd',
                        csh.so_cccd,


                        'ngay_sinh',
                        csh.ngay_sinh,


                        'dia_chi',
                        csh.dia_chi,


                        'so_dien_thoai',
                        csh.so_dien_thoai,


                        'loai',
                        csh.loai,


                        'ty_le_so_huu',
                        shtd.ty_le_so_huu,


                        'ngay_bat_dau',
                        shtd.ngay_bat_dau


                    )

                )

                FILTER(
                    WHERE csh.id IS NOT NULL
                ),


                '[]'

            ) AS chu_so_huu




        FROM thua_dat td



        LEFT JOIN so_huu_thua_dat shtd

        ON shtd.thua_dat_id = td.id

        AND shtd.ngay_ket_thuc IS NULL




        LEFT JOIN chu_so_huu csh

        ON csh.id = shtd.chu_so_huu_id

        AND csh.deleted_at IS NULL




        WHERE td.deleted_at IS NULL

        AND td.geom IS NOT NULL




        GROUP BY td.id



        ORDER BY td.id DESC



        `;

    const result = await db.query(sql);

    return result.rows;
  },

  // =====================================================
  // GET DETAIL
  // =====================================================

  getByThuaDatId: async (id) => {
    const sql = `

        SELECT



        td.*,



        ST_AsGeoJSON(td.geom)::json AS geom,




        -- ======================
        -- CHỦ SỞ HỮU
        -- ======================


        (

            SELECT

            COALESCE(

                json_agg(

                    json_build_object(

                        'id',
                        csh.id,

                        'ho_ten',
                        csh.ho_ten,


                        'so_cccd',
                        csh.so_cccd,


                        'dia_chi',
                        csh.dia_chi,


                        'so_dien_thoai',
                        csh.so_dien_thoai,


                        'ty_le_so_huu',
                        shtd.ty_le_so_huu,


                        'ngay_bat_dau',
                        shtd.ngay_bat_dau


                    )

                ),


                '[]'

            )


            FROM so_huu_thua_dat shtd


            JOIN chu_so_huu csh

            ON csh.id = shtd.chu_so_huu_id



            WHERE shtd.thua_dat_id = td.id


            AND shtd.ngay_ket_thuc IS NULL


            AND csh.deleted_at IS NULL


        )

        AS chu_so_huu,








        -- ======================
        -- BẮC
        -- ======================


        json_build_object(

            'id',
            bac.id,


            'so_thua',
            bac.so_thua,


            'so_to_ban_do',
            bac.so_to_ban_do,


            'dia_chi',
            bac.dia_chi,


            'dien_tich',
            bac.dien_tich,


            'loai_dat',
            bac.loai_dat

        )

        AS bac,








        -- ======================
        -- NAM
        -- ======================


        json_build_object(

            'id',
            nam.id,


            'so_thua',
            nam.so_thua,


            'so_to_ban_do',
            nam.so_to_ban_do,


            'dia_chi',
            nam.dia_chi,


            'dien_tich',
            nam.dien_tich,


            'loai_dat',
            nam.loai_dat


        )

        AS nam,








        -- ======================
        -- ĐÔNG
        -- ======================


        json_build_object(

            'id',
            dong.id,


            'so_thua',
            dong.so_thua,


            'so_to_ban_do',
            dong.so_to_ban_do,


            'dia_chi',
            dong.dia_chi,


            'dien_tich',
            dong.dien_tich,


            'loai_dat',
            dong.loai_dat


        )

        AS dong,








        -- ======================
        -- TÂY
        -- ======================


        json_build_object(

            'id',
            tay.id,


            'so_thua',
            tay.so_thua,


            'so_to_ban_do',
            tay.so_to_ban_do,


            'dia_chi',
            tay.dia_chi,


            'dien_tich',
            tay.dien_tich,


            'loai_dat',
            tay.loai_dat


        )

        AS tay





        FROM thua_dat td








        -- BẮC

        LEFT JOIN thua_dat bac

        ON bac.id <> td.id

        AND ST_IsValid(bac.geom)

        AND ST_Touches(
            td.geom,
            bac.geom
        )

        AND ST_YMax(bac.geom)
            >
            ST_YMax(td.geom)








        -- NAM

        LEFT JOIN thua_dat nam

        ON nam.id <> td.id

        AND ST_IsValid(nam.geom)

        AND ST_Touches(
            td.geom,
            nam.geom
        )

        AND ST_YMin(nam.geom)
            <
            ST_YMin(td.geom)








        -- ĐÔNG

        LEFT JOIN thua_dat dong

        ON dong.id <> td.id

        AND ST_IsValid(dong.geom)

        AND ST_Touches(
            td.geom,
            dong.geom
        )

        AND ST_XMax(dong.geom)
            >
            ST_XMax(td.geom)








        -- TÂY

        LEFT JOIN thua_dat tay

        ON tay.id <> td.id

        AND ST_IsValid(tay.geom)

        AND ST_Touches(
            td.geom,
            tay.geom
        )

        AND ST_XMin(tay.geom)
            <
            ST_XMin(td.geom)







        WHERE td.id=$1

        AND td.geom IS NOT NULL

        AND ST_IsValid(td.geom)

        `;

    const result = await db.query(sql, [id]);

    return result.rows[0];
  },
  // =====================================================
  // TEST THÊM CHỦ SỞ HỮU
  // =====================================================

  // =====================================================
  // THÊM CHỦ SỞ HỮU VÀO THỬA ĐẤT
  // =====================================================

  create: async (data) => {
    const {
      thua_dat_id,
      so_cccd,
      ho_ten,
      so_dien_thoai,
      dia_chi,
      ty_le_so_huu,
    } = data;

    const client = await db.connect();

    try {
      await client.query("BEGIN");

      // ============================
      // 1. TÌM CHỦ SỞ HỮU
      // ============================

      let owner = await client.query(
        `
            SELECT *
            FROM chu_so_huu
            WHERE so_cccd=$1
            AND deleted_at IS NULL
            `,
        [so_cccd],
      );

      let chuSoHuuId;

      // ============================
      // 2. CHƯA CÓ -> TẠO MỚI
      // ============================

      if (owner.rows.length === 0) {
        const insertOwner = await client.query(
          `
                INSERT INTO chu_so_huu
                (
                    ho_ten,
                    so_cccd,
                    so_dien_thoai,
                    dia_chi
                )

                VALUES
                (
                    $1,$2,$3,$4
                )

                RETURNING id
                `,
          [ho_ten, so_cccd, so_dien_thoai, dia_chi],
        );

        chuSoHuuId = insertOwner.rows[0].id;
      } else {
        chuSoHuuId = owner.rows[0].id;
      }

      // ============================
      // 3. GẮN VÀO THỬA ĐẤT
      // ============================

      await client.query(
        `
            INSERT INTO so_huu_thua_dat
            (
                thua_dat_id,
                chu_so_huu_id,
                ty_le_so_huu,
                ngay_bat_dau
            )

            VALUES
            (
                $1,$2,$3,NOW()
            )
            `,
        [thua_dat_id, chuSoHuuId, ty_le_so_huu || 100],
      );

      await client.query("COMMIT");

      return {
        success: true,
        message: "Thêm chủ sở hữu thành công",
      };
    } catch (err) {
      await client.query("ROLLBACK");

      throw err;
    } finally {
      client.release();
    }
  },
};

module.exports = ThuaDatMapModel;
