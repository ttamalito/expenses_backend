const stringIsInteger = require("./stringIsInteger");
const getMonth = require("../../../utils/getMonth");

/**
 * Validates the month from the request
 * Month should be an integer between 1 and 12
 * @param req
 * @param {boolean} isQueryParameter - if the month is a query parameter, if false it is a body parameter
 * @returns {{result: boolean, month: number}|{result: boolean, message: string}}
 */
function validMonthFromReq(req, isQueryParameter) {

    let month;
    if (isQueryParameter) {
        const result = stringIsInteger(req.query.month);
        if (!result) {
            return {result: false, message: "Month should be an integer, received: " + req.query.month};
        }
        month = parseInt(req.query.month);
    } else {
        const result = stringIsInteger(req.body.month);
        if (!result) {
            return {result: false, message: "Month should be an integer, received: " + req.body.month};
        }
        month = parseInt(req.body.month);
    }

    const correctMonth = getMonth(month);
    if (correctMonth === 'a') {
        return {result: false, message: 'Month should be between 1 and 12'};
    }

    return {result: true, month: month};
}

module.exports = validMonthFromReq;