'use strict';

const User = require('../models/user');
const Boom = require('@hapi/boom');
const utils = require('./utils.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Users = {

  authenticate: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await User.findOne({ email: request.payload.email });
        if (!user) {
          return Boom.unauthorized('User not found');
        }
        else{
          const isMatch = await user.comparePassword(request.payload.password);
          if(isMatch == true){
            const token = utils.createToken(user);
            return h.response({ success: true, token: token }).code(201);
          }
          else{
            return Boom.unauthorized('Invalid password');
          }
        }
      } catch (err) {
        return Boom.notFound('internal db failure');
      }
    }
    },

  find: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const users = await User.find();
      return users;
    }
  },

  findOne: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      try {
        const user = await User.findOne({ _id: request.params.id });
        if (!user) {
          return Boom.notFound('No User with this id');
        }
        return user;
      } catch (err) {
        return Boom.notFound('No User with this id');
      }
    }
  },

  create: {
    auth: false,
    handler: async function(request, h) {
      const newUser = new User(request.payload);
      const hash = await bcrypt.hash(request.payload.password, saltRounds);
      newUser.password=hash;
      const user = await newUser.save();
      if (user) {
        return h.response(user).code(201);
      }
      return Boom.badImplementation('error creating user');
    }
  },

  deleteAll: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      await User.deleteMany({});
      return { success: true };
    }
  },

  deleteOne: {
    auth: {
      strategy: 'jwt',
    },
    handler: async function(request, h) {
      const user = await User.deleteOne({ _id: request.params.id });
      if (user) {
        return { success: true };
      }
      return Boom.notFound('id not found');
    }
  }
};

module.exports = Users;