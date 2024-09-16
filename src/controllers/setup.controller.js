const setUpModel = require('../../models/setup.model');
const {set} = require("express/lib/application");
const {parse} = require("nodemon/lib/cli");
const expensesTypes = require('../utils/types');
/**
 * Retrieves the setup for a given year
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
async function getSetUp(req, res, next) {
    // get the year from the url
    const year = parseInt(req.params.year);

    const setUp = await setUpModel.getSetUpByYear(year);

    if (setUp) {
        return res.json({result: true, setUp: setUp});
    }

    return res.json({result: false})

} // end of getSetUp


async function modifySetUp(req, res, next) {
    // get the year
    const year = parseInt(req.params.year);
    // get all the values
    const monthBudget = parseInt(req.body.monthBudget);
    const essentialFood = parseInt(req.body[expensesTypes.ESSENTIAL_FOOD]);
    const nonEssentialFood = parseInt(req.body[expensesTypes.NON_ESSENTIAL_FOOD]);
    const party = parseInt(req.body[expensesTypes.PARTY]);
    const phone = parseInt(req.body[expensesTypes.PHONE]);
    const insurance = parseInt(req.body[expensesTypes.INSURANCE]);
    const home = parseInt(req.body[expensesTypes.HOME]);
    const gift = parseInt(req.body[expensesTypes.GIFT]);
    const recreationalPurchase = parseInt(req.body[expensesTypes.RECREATIONAL_PURCHASE]);
    const rent = parseInt(req.body[expensesTypes.RENT]);
    const other = parseInt(req.body[expensesTypes.OTHER]);

    const typesBudget = {};
    // retrieve the values from the body
    for (const value of Object.values(expensesTypes)) {
        const numericValue = parseInt(req.body[value]);
        console.log(`Value: ${value} Numeric value: ${numericValue}`);
        typesBudget[value] = numericValue;
    }


    //console.log(`MOnth budget: ${monthBudget}`);

    const savedResult = await setUpModel.modifySetUpByYear(year, monthBudget, typesBudget);

    if (!savedResult) {
        // create a new setup
        const created = await setUpModel.createSetUp(year, monthBudget, typesBudget); // TODO: change this!!ºººººººº12º
        if (!created) {
            return res.json({result: false});
        }
        //return res.json({result: false});
    }

    return res.json({result: true});

} // end of function

module.exports = {
    getSetUp,
    modifySetUp
}