const mySql = require('../database/mysqlDbConfig');
const User = require('../models/classes/User');
/**
 * Saves a new user to the database
 * @param {User} user
 * @returns {Promise<string>} - the id of the user
 */
async function createUser(user) {

    const connection = await mySql.createDbConnection();

    try {
        const [results, fields] = await connection.query(
            'INSERT INTO `users` (id, username, email, password, currency_id, profile_picture_path, monthly_budget, creation_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
            [user.id ,user.username, user.email, user.hashedPassword, user.currency_id, user.profilePicturePath, user.monthlyBudget, user.creationDate]
        );
        // console.log(results.insertId); // only for autoincrement ids
        // console.log('affected ' + results.affectedRows + ' rows'); // for update, delete, insert
        // console.log('changed ' + results.changedRows + ' rows'); // for update only!
        // console.log('connected as id ' + connection.threadId); // the connection id
        //console.log(results); // results contains rows returned by server, it also contains the number of affected rows, etc. depending on the operation
        //console.log(fields); // fields contains extra meta data about results, if available
        // in theory a single result could be constructed into a User object and returned

        // kill the connection
        await connection.end();
        if (results.affectedRows === 1) {
            return user.id;
        } else {
            return null;
        }
    } catch (err) {
        console.log(err);
        return null;
    }
}


module.exports = {
    createUser
}