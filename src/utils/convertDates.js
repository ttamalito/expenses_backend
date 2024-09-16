const expenseModel = require('../../models/expense.model');

const moment = require('moment');

function convertDates(format) {
    expenseModel.getAllExpensesForAYear(2024)
        .then((expenses) =>
    {
        expenses.forEach(async (expense) => {
            const date = expense.date;
            let momentDate;
            if (!date) {
                console.log('Date undefined - ');
                console.log(expense.month);
                console.log(expense.year);
                momentDate = moment(`10/${expense.month}/${expense.year}`, "DD/MM/YYYY");
                const dateWithMoment = momentDate.toDate();
                console.log(dateWithMoment);
                const result = await expenseModel.modifyDateOfExpense(expense._id, dateWithMoment);
                if (!result) {
                    console.log('Error modifying date');
                }
            }
            momentDate = moment(date, "DD/MM/YYYY");
            const dateWithMoment = momentDate.toDate();
            const result = await expenseModel.modifyDateOfExpense(expense._id, dateWithMoment);
            //console.log(date);
            if (!result) {
                console.log('Error modifying date');
                console.log(date);
            }
        });
    }).catch((err) => console.error(err));
}

module.exports = convertDates;