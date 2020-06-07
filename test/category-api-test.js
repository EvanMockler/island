'use strict';

const assert = require('chai').assert;
const IslandLogger = require('./island-logger');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Category API tests', function () {

  let categories = fixtures.categories;
  let newCategory = fixtures.newCategory;
  let newUser = fixtures.newUser;

  const islandLogger = new IslandLogger('http://LAPTOP-H3TFJSOQ:3000');

  suiteSetup(async function() {
    await islandLogger.deleteAllUsers();
    const returnedUser = await islandLogger.createUser(newUser);
    const response = await islandLogger.authenticate(newUser);
  });

  suiteTeardown(async function() {
    await islandLogger.deleteAllUsers();
    islandLogger.clearAuth();
  });

  setup(async function () {
    await islandLogger.deleteAllCategories();
  });

  teardown(async function () {
    await islandLogger.deleteAllCategories();
  });

  test('create a category', async function () {
    const returnedCategory = await islandLogger.createCategories(newCategory);
    assert(_.some([returnedCategory], newCategory), 'returnedCategory must be a superset of newCategory');
    assert.isDefined(returnedCategory._id);
  });

  test('get category', async function () {
    const c1 = await islandLogger.createCategories(newCategory);
    const c2 = await islandLogger.getCategory(c1._id);
    assert.deepEqual(c1, c2);
  });

  test('get invalid category', async function () {
    const c1 = await islandLogger.getCategory('1234');
    assert.isNull(c1);
    const c2 = await islandLogger.getCategory('012345678901234567890123');
    assert.isNull(c2);
  });


  test('delete a category', async function () {
    let c = await islandLogger.createCategories(newCategory);
    assert(c._id != null);
    await islandLogger.deleteOneCategory(c._id);
    c = await islandLogger.getCategory(c._id);
    assert(c == null);
  });

  test('get all categories', async function () {
    for (let c of categories) {
      await islandLogger.createCategories(c);
    }
    const allCategories = await islandLogger.getCategories();
    assert.equal(allCategories.length, categories.length);
  });

  test('get categories detail', async function () {
    for (let c of categories) {
      await islandLogger.createCategories(c);
    }

    const allCategories = await islandLogger.getCategories();
    for (var i = 0; i < categories.length; i++) {
      assert(_.some([allCategories[i]], categories[i]), 'returnedCategory must be a superset of newCategory');
    }
  });

  test('get all categories empty', async function () {
    const allCategories = await islandLogger.getCategories();
    assert.equal(allCategories.length, 0);
  });

});
