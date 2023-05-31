const dotenv = require('dotenv').config();

const development = require('./development');
const production = require('./production');

const environment = process.env.NODE_ENV;

let config = environment;
if (!environment) throw new Error('No environment setup on the server');

console.log('Server setup to ' + environment)

if (environment.trim() === 'production') {
    config = Object.assign({}, production);
}

if (environment.trim() === 'development') {
    config = Object.assign({}, development);
}

module.exports = config;