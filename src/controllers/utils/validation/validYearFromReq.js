const stringIsInteger = require("./stringIsInteger");

/**
 * Validates the year from the request
 * Year should be at least 1900
 * @param req
 * @param {boolean} isQueryParameter - if the year is a query parameter, if false it is a body parameter
 * @returns {{result: boolean, month: number}|{result: boolean, message: string}}
 */
function validYearFromReq(req, isQueryParameter) {


    let year;
    if (isQueryParameter) {
        const result = stringIsInteger(req.query.year);
        if (!result.result) {
            return {result: false, message: "Year should be an integer, received: " + req.query.year};
        }
        year = parseInt(req.query.year);
    } else {
        const result = stringIsInteger(req.body.year);
        if (!result) {
            return {result: false, message: "Year should be an integer, received: " + req.body.year};
        }
        year = parseInt(req.body.year);
    }

    if (year < 1900) {
        return {result: false, message: 'Year should be greater than 1900'};
    }

    return {result: true, year: year};
}

module.exports = validYearFromReq;