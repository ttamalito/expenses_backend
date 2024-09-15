const expensesTypes = require('../../../utils/types');

/**
 * Validates that the type is one of the types in types.js
 * @see utils/types.js
 * @param {string} type
 */
function isValidType(type) {
    return Object.values(expensesTypes).includes(type);
}
