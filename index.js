'use strict';

const ImageStore = require('./app/utils/image-store');
const Hapi = require('@hapi/hapi');
require('dotenv').config();
const utils = require('./app/api/utils.js');

const server = Hapi.server({
    port: process.env.PORT || 3000,
    routes: { cors: true }
});


server.validator(require('@hapi/joi'))

const credentials = {
    cloud_name: process.env.name,
    api_key: process.env.key,
    api_secret: process.env.secret
};

const dotenv = require('dotenv');

const result = dotenv.config();
if (result.error) {
    console.log(result.error.message);
    process.exit(1);
}

async function init() {
    await server.register(require('@hapi/inert'));
    await server.register(require('@hapi/vision'));
    await server.register(require('@hapi/cookie'));
    await server.register(require('hapi-auth-jwt2'));

    ImageStore.configure(credentials);

    server.views({
        engines: {
            hbs: require('handlebars')
        },
        relativeTo: __dirname,
        path: './app/views',
        layoutPath: './app/views/layouts',
        partialsPath: './app/views/partials',
        layout: true,
        isCached: false,
    });

    server.auth.strategy('session', 'cookie', {
        cookie: {
            name: process.env.cookie_name,
            password: process.env.cookie_password,
            isSecure: false
        },
        redirectTo: '/',
    });

    server.auth.strategy('jwt', 'jwt', {
        key: 'secretpasswordnotrevealedtoanyone',
        validate: utils.validate,
        verifyOptions: { algorithms: ['HS256'] },
    });

    server.auth.default('session');

    server.route(require('./routes'));
    server.route(require('./routes-api'));
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
}

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});

require('./app/models/db');

init();