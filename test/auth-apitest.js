'use strict';

const assert = require('chai').assert;
const IslandLogger = require('./island-logger');
const fixtures = require('./fixtures.json');
const utils = require('../app/api/utils.js');

suite('Authentication API tests', function () {

  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const islandLogger = new IslandLogger(fixtures.islandLogger);

  setup(async function () {
    await islandLogger.deleteAllUsers();
  });

  test('authenticate', async function () {
    const returnedUser = await islandLogger.createUser(newUser);
    const response = await islandLogger.authenticate(newUser);
    assert(response.success);
    assert.isDefined(response.token);
  });

  test('verify Token', async function () {
    const returnedUser = await islandLogger.createUser(newUser);
    const response = await islandLogger.authenticate(newUser);

    const userInfo = utils.decodeToken(response.token);
    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.userId, returnedUser._id);
  });
});