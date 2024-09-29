const request = require('supertest')

const app = require('../../src/app');
const PORT = 'mongodb://localhost:27017';
const databaseName = 'expenses_db';
const db = require("../../src/database/databaseConfig");

describe('Query set up for a year', () => {

    beforeAll(async () => {
        await db.connectToDataBase(PORT, databaseName);
    });

    afterAll(async () => {
        await db.closeConnection();
    });
    it('should query successfully set up', async () => {
        const year = '2024';
        const endpoint = `/budget/${year}`;
        const response = await request(app).get(endpoint);
        expect(response.status).toEqual(200);
    });


})