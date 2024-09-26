const db = require("./database/databaseConfig");
const app = require("./app");
const PORT = 'mongodb://localhost:27017';
const databaseName = 'expenses_db';

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