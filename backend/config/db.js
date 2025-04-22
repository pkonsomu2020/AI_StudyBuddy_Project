
// DB connection using environment variables from .env file.
//
// Required in your .env:
//
// DB_HOST=localhost
// DB_USER=root
// DB_PASSWORD=ponsomu756@
// DB_NAME=studybuddy
//
// Recommended for security:
// JWT_SECRET=some_long_secret_string
// JWT_EXPIRES_IN=30d

const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, // updated to match .env variable name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;

