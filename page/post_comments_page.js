require('dotenv').config();
const supertest = require('supertest');

const api = supertest(process.env.BASE_URL);

const postComments = (postId, payload, token) => api.post(`/public/v1/posts/${postId}/comments`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send(payload);


module.exports = {
    postComments
}