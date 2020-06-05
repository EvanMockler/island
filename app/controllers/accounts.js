'use strict';

const User = require('../models/user');
const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');

const Accounts = {
  index: {
    auth: false,
    handler: function(request, h) {
      return h.view('main', { title: 'Welcome to Islands' });
    }
  },
  showSignup: {
    auth: false,
    handler: function(request, h) {
      return h.view('signup', { title: 'Sign up for Islands' });
    }
  },
  signup: {
    auth: false,
    validate: {
      payload: {
        firstName: Joi.string().regex(/^[A-Z][a-z-']{0,12}$/), // Names up to 13 characters allowed, hyphen and apostrophe
        lastName: Joi.string().regex(/^[A-Z][a-z-']{0,16}$/), // Names up to 17 characters allowed, hyphen and apostrophe
        email: Joi.string().regex(/^\S+@\S+.+[A-Za-z]$/)
          .email()
          .required(),
        password: Joi.string().regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/), //password must be over 8 characters and an uppercase & lowercase letter, a number
      },
      options: {
        abortEarly: false
      },
      failAction: function(request, h, error) {
        return h
          .view('signup', {
            title: 'Sign up error',
            errors: error.details
          })
          .takeover()
          .code(400);
      }
    },
    handler: async function(request, h) {
      try {
        const payload = request.payload;
        let user = await User.findByEmail(payload.email);
        if (user) {
          const message = 'Email address is already registered';
          throw Boom.badData(message);
        }
        const newUser = new User({
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          password: payload.password
        });
        user = await newUser.save();
        request.cookieAuth.set({ id: user.id });
        return h.redirect('/home');
      } catch (err) {
        return h.view('signup', { errors: [{ message: err.message }] });
      }
    }
  },
  showLogin: {
    auth: false,
    handler: function(request, h) {
      return h.view('login', { title: 'Login to Islands' });
    }
  },
  login: {
    auth: false,
    validate: {
      payload: {
        email: Joi.string().regex(/^\S+@\S+.+[A-Za-z]$/)
          .email()
          .required(),
        password: Joi.string().regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/), //password must be over 8 characters and an uppercase & lowercase letter, a number
      },
      options: {
        abortEarly: false
      },
      failAction: function(request, h, error) {
        return h
          .view('login', {
            title: 'Sign in error',
            errors: error.details
          })
          .takeover()
          .code(400);
      }
    },
    handler: async function(request, h) {
      const { email, password } = request.payload;
      try {
        let user = await User.findByEmail(email);
        if (!user) {
          const message = 'Email address is not registered';
          throw Boom.unauthorized(message);
        }
        user.comparePassword(password);
        request.cookieAuth.set({ id: user.id });
        return h.redirect('/home');
      } catch (err) {
        return h.view('login', { errors: [{ message: err.message }] });
      }
    }
  },
  showSettings: {
    handler: async function(request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id).lean();
        return h.view('settings', { title: 'Member Settings', user: user });
      } catch (err) {
        return h.view('login', { errors: [{ message: err.message }] });
      }
    }
  },
  updateSettings: {
    validate: {
      payload: {
        firstName: Joi.string().regex(/^[A-Z][a-z-']{0,12}$/),
        lastName: Joi.string().regex(/^[A-Z][a-z-']{0,16}$/),
        email: Joi.string().regex(/^\S+@\S+.+[A-Za-z]$/)
          .email()
          .required(),
        password: Joi.string().regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/)
      },
      options: {
        abortEarly: false
      },
      failAction: function(request, h, error) {
        return h
          .view('settings', {
            title: 'Sign up error',
            errors: error.details
          })
          .takeover()
          .code(400);
      }
    },
    handler: async function(request, h) {
      try {
        const userEdit = request.payload;
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        user.firstName = userEdit.firstName;
        user.lastName = userEdit.lastName;
        user.email = userEdit.email;
        user.password = userEdit.password;
        await user.save();
        return h.redirect('/settings');
      } catch (err) {
        return h.view('main', { errors: [{ message: err.message }] });
      }
    }
  },
  logout: {
    handler: function(request, h) {
      request.cookieAuth.clear();
      return h.redirect('/');
    }
  }
};

module.exports = Accounts;