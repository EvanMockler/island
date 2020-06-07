const Categories = require('./app/api/categories');
const Users= require('./app/api/users');
const Islands = require('./app/api/islands');


module.exports = [
  { method: 'GET', path: '/api/categories', config: Categories.find },
  { method: 'GET', path: '/api/categories/{id}', config: Categories.findOne },
  { method: 'POST', path: '/api/categories', config: Categories.create },
  { method: 'DELETE', path: '/api/categories/{id}', config: Categories.deleteOne },
  { method: 'DELETE', path: '/api/categories', config: Categories.deleteAll },
  { method: 'POST', path: '/api/users/authenticate', config: Users.authenticate },
  { method: 'GET', path: '/api/users', config: Users.find },
  { method: 'GET', path: '/api/users/{id}', config: Users.findOne },
  { method: 'POST', path: '/api/users', config: Users.create },
  { method: 'DELETE', path: '/api/users/{id}', config: Users.deleteOne },
  { method: 'DELETE', path: '/api/users', config: Users.deleteAll },
  { method: 'GET', path: '/api/islands', config: Islands.findAll },
  { method: 'GET', path: '/api/categories/{id}/islands', config: Islands.findByCategory },
  { method: 'POST', path: '/api/categories/{id}/islands', config: Islands.addIsland },
  { method: 'DELETE', path: '/api/islands', config: Islands.deleteAll }
];

