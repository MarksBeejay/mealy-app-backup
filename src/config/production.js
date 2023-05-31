const dotenv = require('dotenv').config();

module.exports = {
    mongodbConnectionURL: process.env.PRODUCTION_MONGODB_CONNECTION_URL,
    bcryptSaltRound: +process.env.PRODUCTION_BCRYPT_SALT_ROUND,
    jwt_secret: process.env.PRODUCTION_JWT_SECRET,
    port: +process.env.PORT
}