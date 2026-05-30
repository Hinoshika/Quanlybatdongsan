const { Client } = require("pg");

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "QLD",
    password: "2004",
    port: 5432,
});

client.connect()
    .then(() => console.log("Kết nối PostgreSQL thành công"))
    .catch(err => console.log(err));

module.exports = client;