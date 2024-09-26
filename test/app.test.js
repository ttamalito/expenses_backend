const request = require('supertest')

const app = require('../src/app');


describe('base route', () => {
    it('should return Hello from the backend', async () => {
        const response = await request(app).get('/');
        expect(response.status).toEqual(200);
        expect(response.text).toEqual('Hello from the backend');
    });
})