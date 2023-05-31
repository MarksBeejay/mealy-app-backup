const dotenv = require('dotenv').config();

module.exports = {
    mongodbConnectionUrl: process.env.DEV_MONGODB_CONNECTION_URL,
    bcryptSaltRound: +process.env.DEV_BCRYPT_SALT_ROUND,
    jwt_secret: process.env.DEV_JWT_SECRET,
    port: +process.env.PORT
}