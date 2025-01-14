const cronTasks = require("./cron-tasks");

module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  cron: { enabled: true, tasks: cronTasks },

  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
});
