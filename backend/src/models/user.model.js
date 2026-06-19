const db = require("../config/db");

const UserModel = {
  // ================= GET ALL USERS =================
  getAll: async () => {
    const sql = `
            SELECT
                u.id,
                u.username,
                u.full_name,
                u.email,
                u.phone,
                u.status,
                u.created_at,
                r.id AS role_id,
                r.name AS role
            FROM users u
            LEFT JOIN user_roles ur
                ON u.id = ur.user_id
            LEFT JOIN roles r
                ON ur.role_id = r.id
            ORDER BY u.id DESC
        `;

    const result = await db.query(sql);
    return result.rows;
  },

  // ================= GET USER BY ID =================
  getById: async (id) => {
    const sql = `
            SELECT
                u.id,
                u.username,
                u.full_name,
                u.email,
                u.phone,
                u.status,
                u.created_at,
                r.id AS role_id,
                r.name AS role
            FROM users u
            LEFT JOIN user_roles ur
                ON u.id = ur.user_id
            LEFT JOIN roles r
                ON ur.role_id = r.id
            WHERE u.id = $1
        `;

    const result = await db.query(sql, [id]);

    return result.rows[0];
  },

  // ================= CREATE USER =================
  create: async (data) => {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      const userSql = `
                INSERT INTO users (
                    username,
                    password,
                    full_name,
                    email,
                    phone,
                    status
                )
                VALUES ($1,$2,$3,$4,$5,$6)
                RETURNING id
            `;

      const userResult = await client.query(userSql, [
        data.username,
        data.password,
        data.full_name,
        data.email,
        data.phone,
        data.status || "active",
      ]);

      const userId = userResult.rows[0].id;

      if (data.role_id) {
        await client.query(
          `
                    INSERT INTO user_roles (
                        user_id,
                        role_id
                    )
                    VALUES ($1,$2)
                    `,
          [userId, data.role_id],
        );
      }

      await client.query("COMMIT");

      return {
        id: userId,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  // ================= UPDATE USER =================
  update: async (id, data) => {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      await client.query(
        `
                UPDATE users
                SET
                    full_name = $1,
                    email = $2,
                    phone = $3,
                    status = $4
                WHERE id = $5
                `,
        [data.full_name, data.email, data.phone, data.status, id],
      );

      if (data.role_id) {
        await client.query(
          `
                    DELETE FROM user_roles
                    WHERE user_id = $1
                    `,
          [id],
        );

        await client.query(
          `
                    INSERT INTO user_roles (
                        user_id,
                        role_id
                    )
                    VALUES ($1,$2)
                    `,
          [id, data.role_id],
        );
      }

      await client.query("COMMIT");

      return {
        id,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  // ================= DELETE USER =================
  remove: async (id) => {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      await client.query(
        `
                DELETE FROM user_roles
                WHERE user_id = $1
                `,
        [id],
      );

      await client.query(
        `
                DELETE FROM users
                WHERE id = $1
                `,
        [id],
      );

      await client.query("COMMIT");

      return {
        id,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};

module.exports = UserModel;
