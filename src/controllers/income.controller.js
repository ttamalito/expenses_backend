const budgetModel = require('../models/budget.model');
const expensesTypes = require('../utils/types');
const incomeModel = require('../models/income.model');

/**
 * Retrieves the total earnings for a given year
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
async function getTotalEarnedForAYear(req, res, next) {
    const year = parseInt(req.query.year);

    try {
        const total = await incomeModel.queryTotalEarnedForAYear(year);
        return res.status(200).json({total: total});
    } catch (error) {
        return res.status(500).json({error: error, message: 'Failed to get total earnings' });
    }

}


/**
 * Retrieves the total earnings for a given month
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
async function getTotalEarnedInAMonth(req, res, next) {
    const year = parseInt(req.query.year);
    const month = parseInt(req.query.month);

    try {
        const total = await incomeModel.queryTotalEarnedForAMonth(month, year);
        return res.status(200).json({total: total});
    } catch (error) {
        return res.status(500).json({error: error, message: 'Failed to get total earnings' });
    }

}

async function getTotalEarnedInAYearInAMonthlyBasis(req, res, next) {
    const year = parseInt(req.query.year);

    try {
        const result = await incomeModel.queryTotalEarnedForAYearInAMonthlyBasis(year);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({error: error, message: 'Failed to get total earnings' });
    }
}



module.exports = {
    getTotalEarnedForAYear,
    getTotalEarnedInAMonth,
    getTotalEarnedInAYearInAMonthlyBasis
}