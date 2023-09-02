require('dotenv').config();
const supertest = require('supertest');

const api = supertest(process.env.BASE_URL);

const getPost = (payload, token) => api.get(`/public/v1/posts`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .query(payload);

module.exports = {
    getPost
}