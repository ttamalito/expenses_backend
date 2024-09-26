
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

        let endpoint = `/getExpenseForMonth/${month}/${year}`;
        const response = await request(app).get(endpoint);
        expect(response.status).toEqual(200);
    });


    it('Should query all expenses for a year', async () => {
        const endpoint = `/getExpensesForAYear/${year}`;
        const response = await request(app).get(endpoint);
        expect(response.status).toEqual(200);
    } )


    it('Should query total spent on a year', async () => {
        const endpoint = `/expenses/total-spent?year=${year}`;
        const response = await request(app).get(endpoint);
        expect(response.status).toEqual(200);
    })

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
    })

    it('Query all types', async ()=> {
        let type;
        const allTypes = Object.values(types);
        for (let i = 0; i < allTypes.length; i++) {
            type = allTypes[i];
            const endpoint = `/expenses/single-type?year=${year}&type=${type}`;
            const response = await request(app).get(endpoint);
            expect(response.status).toEqual(200);
        }
    });

})