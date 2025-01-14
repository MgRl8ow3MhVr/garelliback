// Path: ./config/env/production/server.js
// starting from Strapi v 4.6.1 server.js has to be the following
const cronTasks = require("../../cron-tasks");

module.exports = ({ env }) => ({
  proxy: true,
  cron: { enabled: true, tasks: cronTasks },
  host: "0.0.0.0",
  port: process.env.PORT,
  url: env("MY_HEROKU_URL"),
  app: {
    keys: env.array("APP_KEYS"),
  },
  admin: {
    auth: {
      secret: env("ADMIN_JWT_SECRET"),
    },
  },
});
