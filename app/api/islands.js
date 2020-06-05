'use strict';

const Island = require('../models/island');
const Boom = require('@hapi/boom');
const Category = require('../models/category')

const Islands = {
  findAll: {
    auth: false,
    handler: async function (request, h) {
      const islands = await Island.find();
      return islands;
    }
  },

  findByCategory: {
    auth: false,
    handler: async function(request, h) {
      const islands = await Island.find({ category: request.params.id });
      return islands;
    }
  },

  addIsland: {
    auth: false,
    handler: async function(request, h) {
      let island = new Island(request.payload);
      const category = await Category.findOne({ _id: request.params.id });
      if (!category) {
        return Boom.notFound('No Category with this id');
      }
      island.category = category._id;
      island = await island.save();
      return island;
    }
  },

  deleteAll: {
    auth: false,
    handler: async function(request, h) {
      await Island.deleteMany({});
      return { success: true };
    }
  }

};

module.exports = Islands;