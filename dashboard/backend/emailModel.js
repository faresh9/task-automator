// This file now re-exports the database module for compatibility with existing imports
// You could eventually refactor code to import directly from database.js
const { db } = require('./database');

module.exports = { db };
