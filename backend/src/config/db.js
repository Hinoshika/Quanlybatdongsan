const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "QLD",
    password: "2004",
    port: 5432,
});

console.log("PostgreSQL Pool initialized");

module.exports = pool;