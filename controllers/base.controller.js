const moment = require('moment');
const convertDates = require('../src/utils/convertDates');
/**
 *
 * @param req
 * @param res
 * @param next
 */
function base(req, res, next) {
    const date = req.body.date;
    console.log('Received date: ' + date);
    const validDate = new Date(date);

    console.log('DateString: ' + validDate.toDateString());
    console.log('Date String: ' + validDate.toString());
    console.log('Date toISOString: ' + validDate.toISOString());
    console.log('Valid date: ' + validDate);
    console.log('In milliseconds:' + validDate.getTime())
    const someDate = new Date(validDate.getTime());
    console.log('Some date: ' + someDate);
    const invalidDate = new Date("whatever");
    console.log(invalidDate);
    console.log(typeof invalidDate);
    const wahtever = 'whatever';
    console.log(typeof wahtever);
    console.log('Invalid date: ' + invalidDate);
    console.log('Invalid date string: ' + invalidDate.toString());
    console.log('Invalid date: ' + invalidDate);

    const momentDate = moment(date, "DD/MM/YYYY");
    const dateWithMoment = momentDate.toDate();
    console.log('Moment date: ' + dateWithMoment);
    console.log('Moment date string: ' + dateWithMoment.toString());

    const datePicker = req.body.datePicker;
    console.log('Received date: ' + datePicker);
    const validDatePicker = new Date(datePicker);
    console.log("Type of datepicker: " + typeof validDatePicker);
    console.log('Valid date: ' + validDatePicker);

    //convertDates('DD/MM/YYYY');
    res.send('Hello from the backend')
} // end of base

module.exports = {
    base: base
}