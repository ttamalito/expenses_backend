
require('dotenv').config();
const mysql = require('mysql2/promise');

/**
 * Creates a connection to the MySQL database using environment variables.
 *
 * @returns {Promise<mysql.Connection>} A promise that resolves to the MySQL connection object.
 * @throws {Error} If the DB_HOST environment variable is not set.
 */
async function createDbConnection() {
    console.log(process.env.DB_HOST);
    if (!process.env.DB_HOST) {
        throw new Error('DB_HOST environment variable not set');
    }
    console.log(process.env.DB_USER);

    console.log(process.env.DB_PASSWORD);
    console.log(process.env.DB_NAME);
    console.log(process.env.DB_PORT);
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
}
);
    return connection;
}

// createDbConnection().then(async (connection) => {
//     console.log('Connected to the database');
//     try {
//         const [results, fields] = await connection.query(
//             'INSERT INTO currencies (currency, currency_character) VALUES ("Colombian peso", "$");'
//         );
//
//         console.log(results); // results contains rows returned by server
//         console.log(fields); // fields contains extra meta data about results, if available
//     } catch (err) {
//         console.log(err);
//     }
// });

module.exports = {
    createDbConnection
};