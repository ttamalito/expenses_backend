const request = require('supertest')

const app = require('../../src/app');
const PORT = 'mongodb://localhost:27017';
const databaseName = 'expenses_db';
const db = require("../../src/database/databaseConfig");

describe('Query total earned', () => {

    beforeAll(async () => {
        await db.connectToDataBase(PORT, databaseName);
    });

    afterAll(async () => {
        await db.closeConnection();
    });
    it('should query successfully total earned', async () => {
        const year = '2024';
        const endpoint = `/income/total-earned?year=${year}`;
        const response = await request(app).get(endpoint);
        expect(response.status).toEqual(200);
    });

    it('should return 500 status code when no connection to db', async () => {
        await db.closeConnection();
        const year = '2024';
        const endpoint = `/income/total-earned?year=${year}`;
        const response = await request(app).get(endpoint);
        expect(response.status).toEqual(500);
    });

})