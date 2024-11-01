const request = require('supertest')

const app = require('../../src/app');
const PORT = 'mongodb://localhost:27017';
const databaseName = 'expenses_db';
const db = require("../../src/database/databaseConfig");

describe('Check CORS Headers are present', () => {

    beforeAll(async () => {
        await db.connectToDataBase(PORT, databaseName);
    });

    afterAll(async () => {
        await db.closeConnection();
    });
    it('should append all the necessary CORS Headers', async () => {
        const endpoint = `/`;
        const response = await request(app).get(endpoint);
        expect(response.status).toEqual(200);
        console.log(response.headers);
        expect(response.headers['access-control-allow-origin']).toEqual('http://localhost:3000');
        expect(response.headers['access-control-allow-credentials']).toEqual('true');
        expect(response.headers['access-control-allow-methods']).toEqual('GET, POST, PUT, DELETE, OPTIONS');
        expect(response.headers['access-control-allow-headers']).toEqual('append,delete,entries,foreach,get,has,keys,set,values,Authorization,content-type');
    });


})