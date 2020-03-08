'use strict';

const Accounts = require('./app/controllers/accounts');
const Islands = require('./app/controllers/islands');

module.exports = [
    { method: 'GET', path: '/', config: Accounts.index },
    { method: 'GET', path: '/signup', config: Accounts.showSignup },
    { method: 'GET', path: '/login', config: Accounts.showLogin },
    { method: 'GET', path: '/logout', config: Accounts.logout },
    { method: 'POST', path: '/signup', config: Accounts.signup },
    { method: 'POST', path: '/login', config: Accounts.login },
    { method: 'POST', path: '/uploadfile', config: Islands.addIsland },
    { method: 'GET', path: '/settings', config: Accounts.showSettings },
    { method: 'POST', path: '/settings', config: Accounts.updateSettings },
    { method: 'GET', path: '/island_info/{id}', config: Islands.showIsland },
    { method: 'POST', path: '/updateIsland/{id}', config: Islands.updateIsland },
    { method: 'GET', path: '/deleteIsland/{id}', config: Islands.deleteIsland },


    { method: 'GET', path: '/home', config: Islands.home },
    { method: 'GET', path: '/report', config: Islands.report },
    {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: './public'
            }
        },
        options: { auth: false }
    }
];