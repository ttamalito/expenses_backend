const { v4: uuidv4 } = require('uuid');


class User {

    id;
    username;
    hashedPassword;
    email;
    currency_id;
    profilePicturePath;
    monthlyBudget;
    creationDate;

    /**
     * Creates a User object
     * @param {string} id - the uuid of the user
     * @param {string} username
     * @param {string} hashedPassword
     * @param {string} email
     * @param {number} currency_id -int in the database
     * @param {string} profilePicturePath
     * @param {number} monthlyBudget - Decimal in the database
     * @param {Date} creationDate
     */
    constructor(id, username, hashedPassword, email, currency_id, profilePicturePath, monthlyBudget, creationDate) {

        if (!this.notNullFields(id, username, hashedPassword, email, currency_id, profilePicturePath, monthlyBudget, creationDate)) {
            throw new Error('One or more fields are null or undefined');
        }

        this.id = id;
        this.username = username;
        this.hashedPassword = hashedPassword;
        this.email = email;
        this.currency_id = currency
        this.profilePicturePath = profilePicturePath;
        this.monthlyBudget = monthlyBudget;
        this.creationDate = creationDate;
    }


    /**
     * Verifies that none of the fields are null or undefined
     * @param id
     * @param username
     * @param hashedPassword
     * @param email
     * @param currency_id
     * @param profilePicturePath
     * @param monthlyBudget
     * @param creationDate
     * @returns {boolean}
     */
    notNullFields(id, username, hashedPassword, email, currency_id, profilePicturePath, monthlyBudget, creationDate) {
        const fields = [id, username, hashedPassword, email, currency_id, profilePicturePath, monthlyBudget, creationDate];

        for (const field of fields) {
            if (field === null || field === undefined) {
                return false;
            }
        }

        return true;
    }

}