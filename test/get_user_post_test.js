require('dotenv').config();
const chai = require('chai');
const authToken = process.env.BEARER
const assert = require('chai').expect;
chai.use(require('chai-json-schema'));

const page = require('../page/get_user_post_page.js');
const data = require('../data/fixtures/get_user_post_data.json');
const schema = require('../data/schema/get_user_post_schema.json');
const errorMessage = require("../data/error_message.json");

const testCase = {
    describe: "GET User Post",
    positive: {
        correctPost: "As a User, I want to be able to find Post contains title Catalyst and body BUILD TRUST EMPOWER OTHERS"
    },
    negative: {
        noPostByTitle: "As a User, I cannot be able to find Post contains incorrect title keywords",
        noPostByBody: "As a User, I cannot be able to find Post contains incorrect body keywords",
        invalidToken: "As a User, I cannot be able to find Post with invalid Authentication",
        emptyToken: "As a User, I cannot be able to find Post with empty Authentication"
    }
}

describe(testCase.describe, () => {

    it(`@get ${testCase.positive.correctPost}`, async () => {
        const response = await page.getPost(data.valid, authToken);
        assert(response.status).to.equal(200);
        assert(response.body.data[0].title).to.have.string(data.valid.title);
        assert(response.body.data[0].body).to.equal(data.valid.body);
        assert(response.body).to.be.jsonSchema(schema);
        assert(response.body.meta.pagination.total).to.equal(response.body.data.length);
    });

    it(`@get ${testCase.negative.noPostByTitle}`, async () => {
        let unPatternedTitle = JSON.parse(JSON.stringify(data.valid));
        unPatternedTitle.title = ")(*)(*";
        const response = await page.getPost(unPatternedTitle, authToken);
        assert(response.status).to.equal(200);
        assert(response.body.data).to.be.empty;
        assert(response.body).to.be.jsonSchema(schema);
        assert(response.body.meta.pagination.total).to.equal(response.body.data.length);
    });

    it(`@get ${testCase.negative.noPostByBody}`, async () => {
        let unPatternedBody = JSON.parse(JSON.stringify(data.valid));
        unPatternedBody.body = ")(*)(*";
        const response = await page.getPost(unPatternedBody, authToken);
        assert(response.status).to.equal(200);
        assert(response.body.data).to.be.empty;
        assert(response.body).to.be.jsonSchema(schema);
        assert(response.body.meta.pagination.total).to.equal(response.body.data.length);
    });

    it(`@get ${testCase.negative.invalidToken}`, async () => {
        const response = await page.getPost(data.valid, `${authToken}a`);
        assert(response.status).to.equal(401);
        assert(response.body.data.message).to.equal(errorMessage.auth.invalidToken);
    });

    it(`@get ${testCase.negative.emptyToken}`, async () => {
        const response = await page.getPost(data.valid, '');
        assert(response.status).to.equal(200);
        assert(response.body.data).to.be.empty;
        assert(response.body).to.be.jsonSchema(schema);
        assert(response.body.meta.pagination.total).to.equal(response.body.data.length);
    });
}) 