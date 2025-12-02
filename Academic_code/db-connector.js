// Get an instance of mysql we can use in the app
const mysql = require('mysql2');

// Create a 'connection pool' using the provided credentials
const pool = mysql.createPool({
    waitForConnections: true,
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_[ONID]',
    password: '[your_db_password]',
    database: 'cs340_[ONID]'
}).promise();

// Export it for use in application
module.exports = pool;

/******Citations*******/
/* All work is based of course material from CS 340*/