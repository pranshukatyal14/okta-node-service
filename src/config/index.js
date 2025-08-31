
require('dotenv').config();

const config = {
  oktaDomain: process.env.OKTA_DOMAIN,
  apiToken: process.env.OKTA_API_TOKEN,
  port: process.env.PORT || 3000,
  apiAuthToken:process.env.API_AUTH_TOKEN
};

module.exports = { config };
