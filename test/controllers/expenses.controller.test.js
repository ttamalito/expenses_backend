
const request = require('supertest')

const app = require('../../src/app');
const PORT = 'mongodb://localhost:27017';
const databaseName = 'expenses_db';
const db = require("../../src/database/databaseConfig");
const year = '2024';
const month = '9';
const types = require('../../src/utils/types');


describe('Query Expenses', () => {

    beforeEach(async () => {
        await db.connectToDataBase(PORT, databaseName);
    });

    afterEach(async () => {
        await db.closeConnection();
    });
    it('should query successfully all expenses for a month', async () => {

        let endpoint = `getExpenseForMonth/${month}/${year}`;
        const response = await request(app).get(endpoint);
        expect(response.status).toEqual(200);
    });

    it('should return 500 status code when no connection to db', async () => {
        await db.closeConnection();
        const response = await request(app).get(endpoint);
        expect(response.status).toEqual(500);
    });

    it('Should query all expenses for a year', async () => {
        const endpoint = `getExpensesForAYear/${year}`;
        const response = await request(app).get(endpoint);
        expect(response.status).toEqual(200);
    } )

    it('should return 500 status code when no connection to db', async () => {
        await db.closeConnection();
        const endpoint = `getExpensesForAYear/${year}`;
        const response = await request(app).get(endpoint);
        expect(response.status).toEqual(500);
    });

});

describe('Query Expenses of a type', () => {
    beforeEach(async () => {
        await db.connectToDataBase(PORT, databaseName);
    });

    afterEach(async () => {
        await db.closeConnection();
    });

    it('Query NON_ESSENTIAL_FOOD for year', async ()=> {
        const type = types.ESSENTIAL_FOOD;
        const endpoint = `/expenses/single-type?year=${year}&type=${type}`;
        const response = await request(app).get(endpoint);
        expect(response.status).toEqual(200);
        console.log(response);
    })

})