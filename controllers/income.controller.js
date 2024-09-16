const setUpModel = require('../models/setup.model');
const expensesTypes = require('../src/utils/types');
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


module.exports = {
    getTotalEarnedForAYear
}