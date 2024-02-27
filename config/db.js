const mysql = require('mysql2/promise');

const dbConfig = {
  host: "database-2.cne282aq27vi.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "00000000",
  database: 'InsightHub'
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
