const stringIsFloat = require("../utils/validation/stringIsFloat");
const stringIsInteger = require("../utils/validation/stringIsInteger");
const getMonth = require("../../utils/getMonth");
const isValidType = require("../utils/validation/validType");
const isValidTransactionType = require("../utils/validation/isValidTransactionType");
const validMonthFromReq = require("../utils/validation/validMonthFromReq");
const expenseModel = require("../../models/expense.model");
const incomeModel = require("../../models/income.model");
const monthModel = require("../../models/month.model");
const budgetModel = require("../../models/budget.model");
const validYearFromReq = require("../utils/validation/validYearFromReq");
const ObjectId = require('mongodb').ObjectId;

/**
 * Validates all the data for addExpense in expenses.controller
 * All the data that the client sent
 * @see controllers/expenses.controller.js
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function addExpense(req, res, next) {

    console.log('Validating data for addExpense');
    const stringIsFloatResult = stringIsFloat(req.body.amount);

    if (!stringIsFloatResult.result) {
        return res.status(400).json({result: false, message: "Amount should be a float, received: " + req.body.amount});
    }
    let amount = parseFloat(req.body.amount);
    // amount should be greter than zero
    if (amount <= 0) {
        return res.status(400).json({result: false, message: 'Amount should be greater than zero, received: ' + amount});
    }


    if (stringIsInteger(req.body.month) === false) {
        return res.status(400).json({result: false, message: "Month should be an integer, received: " + req.body.month});
    }

    // verify that it is the correct month

    const month = parseInt(req.body.month);
    const correctMonth = getMonth(month);
    if (correctMonth === 'a') {
        return res.status(400).json({result: false, message: 'Month should be between 1 and 12'});
    }

    if (stringIsInteger(req.body.year) === false) {
        return res.status(400).json({result: false, message: "Year should be an integer, received: " + req.body.year});
    }
    const year = parseInt(req.body.year);

    if (year < 1900) {
        return res.status(400).json({result: false, message: 'Year should be greater than 1900'});
    }

    const type = req.body.type;
    if (!isValidType(type)) {
        return res.status(400).json({result: false, message: 'Invalid Expense type'});
    }
    const notes = req.body.notes;
    const date = req.body.date;
    const validDate = new Date(date);
   if (validDate.toString() === 'Invalid Date') {
         return res.status(400).json({result: false, message: 'Invalid Date, received: ' + date});
   }
    // get the type of transaction
    const transaction = req.body.transaction;
   if (!isValidTransactionType(transaction)) {
         return res.status(400).json({result: false, message: 'Invalid Transaction Type'});
   }
    next();
} // end of add expense

/**
 * Validates all the data for getTotalSpentOnAMonth in expenses.controller
 * GET /expenses/total-spent/monthly?month=1&year=2020&type=someType
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function getTotalSpentOnAMonth(req, res, next) {

    const result = validMonthFromReq(req, true);
    if (!result.result) {
        return res.status(400).json({message: result.message});
    }

    const yearResult = validYearFromReq(req, true);

    if (!yearResult.result) {
        return res.status(400).json({message: yearResult.message});
    }

    const type = req.query.type;
    if (!isValidType(type) && type !== 'all') {
        return res.status(400).json({result: false, message: 'Invalid Expense type'});
    }

    next();

}

/**
 * Validates all the data for deleteExpense in expenses.controller
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function deleteExpense(req, res, next) {
    if (!req.body.expenseId) {
        return res.status(400).json({message: 'Expense Id is required'});
    }

    const expenseId = req.body.expenseId;


    try {
        const objectid = new ObjectId(expenseId);
    } catch (e) {
        return res.status(400).json({message: 'Invalid expense id'});
    }

    next();
}

module.exports = {
    addExpense,
    getTotalSpentOnAMonth,
    deleteExpense
};