const express = require('express');


//const path = require('path');
// import files
const addCORSHeader = require('./middlewares/addCORSHeader');


//const bodyParser = require('body-parser');



// import the routes
const baseRoutes = require('./routes/base.routes');
const expenseRoutes = require('./routes/expenses.routes')
const setUpRoutes = require('./routes/budget.routes');
const incomeRoutes = require('./routes/income.routes');

const app = express();


// parse the data for multipart/form-data
app.use(express.urlencoded({
    extended: false,
    type: 'application/x-www-form-urlencoded'
}));


app.use(addCORSHeader);




// use the routes
app.use(baseRoutes);
app.use('/expenses', expenseRoutes);
app.use('/budget', setUpRoutes);
app.use( '/income',incomeRoutes);
// the http server


module.exports = app;