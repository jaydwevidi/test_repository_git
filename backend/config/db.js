const mysql = require("mysql2/promise");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "00000000",
  database: "InsightHub",
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
