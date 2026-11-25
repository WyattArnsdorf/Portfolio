/*
 * Citation: Adapted from CS340 starter code
 * Date: 11/07/2025
 * Source: CS 340 course materials, Oregon State University
 */

// Get an instance of mysql we can use in the app
const mysql = require('mysql2');

// Create a 'connection pool' using the provided credentials
const pool = mysql.createPool({
    waitForConnections: true,
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_merrittb',
    password: '6908',
    database: 'cs340_merrittb'
}).promise();

// Export it for use in application
module.exports = pool;