const transactionTypes = require('../../../src/utils/transactionTypes');

function isValidTransactionType(transaction) {
    return transaction === transactionTypes.EXPENSE || transaction === transactionTypes.INCOME;
}

module.exports = isValidTransactionType;