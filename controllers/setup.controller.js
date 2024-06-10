const setUpModel = require('../models/setup.model');
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

    // save the data to the database
    const typesBudget = {
        essential_food: essentialFood,
        non_essential_food: nonEssentialFood,
        party,
        phone,
        insurance,
        home,
        gift,
        recreational_purchase: recreationalPurchase,
        rent,
        other
    }
    //console.log(`MOnth budget: ${monthBudget}`);

    const savedResult = await setUpModel.modifySetUpByYear(year, monthBudget, typesBudget);

    if (!savedResult) {
        return res.json({result: false});
    }

    return res.json({result: true});

} // end of function

module.exports = {
    getSetUp,
    modifySetUp
}