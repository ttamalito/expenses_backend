/**
 * Check if a string is an integer
 * @param value
 * @returns {{result: boolean}}
 */
function stringIsInteger(value) {
    const number = parseInt(value);

    if (isNaN(number)) {
        return {result:false};
    }

    return {result:true};
}

module.exports = stringIsInteger;