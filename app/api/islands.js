'use strict';

const Island = require('../models/island');
const Boom = require('@hapi/boom');
const Category = require('../models/category');
const utils = require('./utils.js');

const Islands = {
  findAll: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function (request, h) {
      const islands = await Island.find();
      return islands;
    }
  },

  findByCategory: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const islands = await Island.find({ category: request.params.id });
      return islands;
    }
  },

  addIsland: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const userId = utils.getUserIdFromRequest(request);
      let island = new Island(request.payload);
      const category = await Category.findOne({ _id: request.params.id });
      if (!category) {
        return Boom.notFound('No Category with this id');
      }
      island.category = category._id;
      island.member = userId;
      island = await island.save();
      return island;
    }
  },

  deleteAll: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      await Island.deleteMany({});
      return { success: true };
    }
  }

};

module.exports = Islands;