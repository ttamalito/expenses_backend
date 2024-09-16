/**
 * Check if a string is a float
 * @param {string} value
 * @returns {boolean} true if the string is a float, false otherwise
 */
function stringIsFloat(value) {
    const number = parseFloat(value);
    if (isNaN(number)) {
        return {result:false, message:'The provided string is not a Float'};
    }
    return {result:true};
}

module.exports = stringIsFloat;