const ObjectId = require('mongodb').ObjectId;

/**
 * Checks if the id is in the array of objectIds
 * @param {[ObjectId]} array
 * @param {string} id
 */
function arrayContainsObjectId(array, id) {
    const result = false;
    for (const objectId of array) {
        if (objectId.toString() === id)
            return true
    }

    return result;
}

module.exports = arrayContainsObjectId;