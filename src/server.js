const db = require("./database/databaseConfig");
const app = require("./app");
const PORT = 'mongodb://localhost:27017';
const databaseName = process.env.MONGO_DEV_DB ||  'expenses_db';
const createDbConnection = require('./database/mysqlDbConfig').createDbConnection;
let server;
// start listening, if we connect to the database
db.connectToDataBase(PORT, databaseName).then(
    () => {
        // the promise was fulfilled
        const port = process.env.PORT || 3000;
        server = app.listen(port);
        console.log('Listening on port ' + port);
        createDbConnection().then(async (connection) => {
            console.log('Connected to the SQL database');
            connection.end();
        }).catch((error) => {
            console.error(error);
            console.log('Error connection to the SQL database');
            throw error;
        });
    }
).catch(
    (error) => {
        console.error(error);
        console.log('No connection to the database established')
    }
)