'use strict';

const assert = require('chai').assert;
const IslandLogger = require('./island-logger');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Island API tests', function () {

  let islands = fixtures.islands;
  let newCategory = fixtures.newCategory;
  let newUser = fixtures.newUser;

  const islandLogger = new IslandLogger(fixtures.islandLogger);

  suiteSetup(async function() {
    await islandLogger.deleteAllUsers();
    const returnedUser = await islandLogger.createUser(newUser);
    const response = await islandLogger.authenticate(newUser);
  });

  suiteTeardown(async function() {
    await islandLogger.deleteAllUsers();
    islandLogger.clearAuth();
  });


  setup(async function() {
    islandLogger.deleteAllCategories();
    islandLogger.deleteAllIslands();

  });

  teardown(async function() {});

  test('create an island', async function() {
    const returnedCategory = await islandLogger.createCategories(newCategory);
    console.log("Returned Category: "+returnedCategory.category);
    await islandLogger.addIsland(returnedCategory._id, islands[0]);
    const returnedIslands = await islandLogger.getIslands(returnedCategory._id);
    assert.equal(returnedIslands.length, 1);
    assert(_.some([returnedIslands[0]], islands[0]), 'returned island must be a superset of island');
  });

  test('create multiple islands', async function() {
    const returnedCategory = await islandLogger.createCategories(newCategory);
    for (var i = 0; i < islands.length; i++) {
      await islandLogger.addIsland(returnedCategory._id, islands[i]);
    }

    const returnedIslands = await islandLogger.getIslands(returnedCategory._id);
    assert.equal(returnedIslands.length, islands.length);
    for (var i = 0; i < islands.length; i++) {
      assert(_.some([returnedIslands[i]], islands[i]), 'returned island must be a superset of island');
    }
  });

  test('delete all islands', async function() {
    const returnedCategory = await islandLogger.createCategories(newCategory);
    for (var i = 0; i < islands.length; i++) {
      await islandLogger.addIsland(returnedCategory._id, islands[i]);
    }

    const d1 = await islandLogger.getIslands(returnedCategory._id);
    assert.equal(d1.length, islands.length);
    await islandLogger.deleteAllIslands();
    const d2 = await islandLogger.getIslands(returnedCategory._id);
    assert.equal(d2.length, 0);
  });

  test('create an island and check member', async function() {
    const returnedCategory = await islandLogger.createCategories(newCategory);
    await islandLogger.addIsland(returnedCategory._id, islands[0]);
    const returnedIslands = await islandLogger.getIslands(returnedCategory._id);
    assert.isDefined(returnedIslands[0].member);

    const users = await islandLogger.getUsers();
    assert(_.some([users[0]], newUser), 'returnedUser must be a superset of newUser');
  });

});