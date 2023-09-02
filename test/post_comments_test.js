require("dotenv").config();
const chai = require("chai");
const authToken = process.env.BEARER
const assert = require("chai").expect;
chai.use(require("chai-json-schema"));

const pagePost = require("../page/get_user_post_page.js");
const dataPost = require("../data/fixtures/get_user_post_data.json");
const pageComments = require("../page/post_comments_page.js");
const dataComments = require("../data/fixtures/post_comments_data.json");
const schema = require("../data/schema/post_comments_schema.json");
const errorMessage = require("../data/error_message.json");
let postId;

const testCase = {
    describe: "POST Comment User's Post",
    positive: {
        commentPost: "As a User, I want to be able to comment on a Post",
    },
    negative: {
        notExistedPost: "As a User, I cannot be able to comment on Post that doesn't exist",
        invalidPostId: "As a User, I cannot be able to comment on Post that doesn't exist",
        invalidToken: "As a User, I cannot be able to comment on Post with invalid Authentication",
        emptyToken: "As a User, I cannot be able to comment on Post with empty Authentication",
        emptyName: "As a User, I cannot be able to comment on Post with empty Name",
        emptyEmail: "As a User, I cannot be able to comment on Post with empty Email",
        emptyBody: "As a User, I cannot be able to comment on Post with empty Body",
        invalidEmailFormat: "As a User, I cannot be able to comment on Post with invalid email format"
    }
}

describe(testCase.describe, () => {
    // Disclaimer, because the post ID suggested in the test docs (10355) doesn't exist, so i use my own Post ID
    before(`@post Getting postId`, async () => {
        const response = await pagePost.getPost(dataPost.valid, authToken);
        assert(response.status).to.equal(200);
        postId = response.body.data[0].id;
    });

    it(`@post ${testCase.positive.commentPost}`, async () => {
        const response = await pageComments.postComments(postId, dataComments.valid, authToken);
        assert(response.status).to.equal(201);
        assert(response.body.data.name).to.equal(dataComments.valid.name);
        assert(response.body.data.email).to.equal(dataComments.valid.email);
        assert(response.body.data.body).to.equal(dataComments.valid.body);
        assert(response.body).to.be.jsonSchema(schema);
    });
    it(`@post ${testCase.negative.notExistedPost}`, async () => {
        const response = await pageComments.postComments(10355, dataComments.valid, authToken);
        assert(response.status).to.equal(422);
        assert(response.body.data[0].field).to.equal(errorMessage.post.field);
        assert(response.body.data[0].message).to.equal(errorMessage.post.message);
    });
    it(`@post ${testCase.negative.invalidPostId}`, async () => {
        const response = await pageComments.postComments("la", dataComments.valid, authToken);
        assert(response.status).to.equal(422);
        assert(response.body.data[0].field).to.equal(errorMessage.post.field);
        assert(response.body.data[0].message).to.equal(errorMessage.post.message);
        assert(response.body.data[1].field).to.equal(errorMessage.post_id.field);
        assert(response.body.data[1].message).to.equal(errorMessage.post_id.message);
    });
    it(`@post ${testCase.negative.invalidToken}`, async () => {
        const response = await pageComments.postComments(postId, dataComments.valid, `${authToken}a`);
        assert(response.status).to.equal(401);
        assert(response.body.data.message).to.equal(errorMessage.auth.invalidToken);
    });
    it(`@post ${testCase.negative.emptyToken}`, async () => {
        const response = await pageComments.postComments(postId, dataComments.valid, "");
        assert(response.status).to.equal(401);
        assert(response.body.data.message).to.equal(errorMessage.auth.emptyAuth);
    });
    it(`@post ${testCase.negative.emptyName}`, async () => {
        let emptyName = JSON.parse(JSON.stringify(dataComments.valid));
        emptyName.name = "";
        const response = await pageComments.postComments(postId, emptyName, authToken);
        assert(response.status).to.equal(422);
        assert(response.body.data[0].field).to.equal(errorMessage.name.field);
        assert(response.body.data[0].message).to.equal(errorMessage.name.message);
    });
    it(`@post ${testCase.negative.emptyEmail}`, async () => {
        let emptyEmail = JSON.parse(JSON.stringify(dataComments.valid));
        emptyEmail.email = "";
        const response = await pageComments.postComments(postId, emptyEmail, authToken);
        assert(response.status).to.equal(422);
        assert(response.body.data[0].field).to.equal(errorMessage.email.field);
        assert(response.body.data[0].message).to.equal(`${errorMessage.email.message[0]}, ${errorMessage.email.message[1]}`);
    });
    it(`@post ${testCase.negative.emptyBody}`, async () => {
        let emptyBody = JSON.parse(JSON.stringify(dataComments.valid));
        emptyBody.body = "";
        const response = await pageComments.postComments(postId, emptyBody, authToken);
        assert(response.status).to.equal(422);
        assert(response.body.data[0].field).to.equal(errorMessage.body.field);
        assert(response.body.data[0].message).to.equal(errorMessage.body.message);
    });
    it(`@post ${testCase.negative.invalidEmailFormat}`, async () => {
        let invalidEmail = JSON.parse(JSON.stringify(dataComments.valid));
        invalidEmail.email = "johndoe";
        const response = await pageComments.postComments(postId, invalidEmail, authToken);
        assert(response.status).to.equal(422);
        assert(response.body.data[0].field).to.equal(errorMessage.email.field);
        assert(response.body.data[0].message).to.equal(errorMessage.email.message[1]);
    });
}) 