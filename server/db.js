const { Pool } = require('pg');

const pool = new Pool({
	user: 'huy',
	database: 'books_dictionary',
	password: 'H27u07y03@',
	port: 5432,
	host: 'localhost',
})

module.exports = {pool};