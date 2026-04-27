const serverless = require('serverless-http');
const app = require('../../sepsisguard-backend/index');

module.exports.handler = serverless(app);
