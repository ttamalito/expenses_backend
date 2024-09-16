const express = require('express');


//const path = require('path');
// import files
const db = require('./src/database/databaseConfig');
const addCORSHeader = require('./middlewares/addCORSHeader');


//const bodyParser = require('body-parser');


const PORT = 'mongodb://localhost:27017';
const databaseName = 'expenses_db';
// import the routes
const baseRoutes = require('./routes/base.routes');
const expenseRoutes = require('./routes/expenses.routes')
const setUpRoutes = require('./routes/setup.routes');
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
app.use(expenseRoutes);
app.use(setUpRoutes);
app.use( '/income',incomeRoutes);
// the http server
let server;
// start listening, if we connect to the database
db.connectToDataBase(PORT, databaseName).then(
    () => {
        // the promise was fulfilled
        server = app.listen(8080);
        console.log('Listening on port 8080');
    }
).catch(
    (error) => {
        console.error(error);
        console.log('No connection to the database established')
    }
)