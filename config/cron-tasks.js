module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */

  myJob: {
    task: async ({ strapi }) => {
      console.log("CRON GO");
      const entries = await strapi.entityService.findMany(
        "api::evaluation.evaluation",
        {
          fields: ["status"],
          filters: { status: "started", emailsent: false },
          populate: {
            teenager: {
              fields: ["first_name", "last_name", " entry_date"],
              populate: {
                educator: {
                  fields: ["username", "email"],
                },
              },
            },
            evaluation_time: {
              fields: ["months"],
            },
          },
        }
      );

      entries.forEach((entry) => {
        console.log(entry);
      });

      // Add your own logic here (e.g. send a queue of email, create a database backup, etc.).
    },
    options: {
      rule: "0,10,20,30,40,50 * * * * *",
    },
  },
};
