import request from 'supertest';
import app from '../src/app';

describe('GET /', () => {
  it('should respond with a 200', async() => {
    const response = await request(app).get('/api/v1');
    expect(response.status).toEqual(200);
  });
});

describe('Invalid Route', () => {
  it('should respond with a 404', async () => {
    const response = await request(app).get('/invalid-endpoint');
    expect(response.status).toEqual(404);
  });
});
