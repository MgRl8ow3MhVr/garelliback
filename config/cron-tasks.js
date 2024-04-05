module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */

  myJob: {
    task: async ({ strapi }) => {
      console.log("- - - - - - EMAIL CRON START - - - - - - - ");
      console.log(new Date(Date.now()));
      const entries = await strapi.entityService.findMany(
        "api::evaluation.evaluation",
        {
          fields: ["status", "emailsent"],
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
              fields: ["months", "name"],
            },
          },
        }
      );

      entries.forEach(async (entry) => {
        const evalMonths = entry?.evaluation_time?.months;
        const entryDate = new Date(entry?.teenager?.entry_date);
        const now = new Date(Date.now());
        const dueDate = new Date(
          entryDate.setMonth(entryDate.getMonth() + Number(evalMonths))
        );

        const diffDays = Math.ceil(
          (dueDate.valueOf() - now.valueOf()) / (1000 * 60 * 60 * 24)
        );
        console.log(`evaluating eval ${entry.id} - to do in ${diffDays} days`);

        if (diffDays <= Number(process.env.DAYSREMINDER) && diffDays >= -2) {
          const email = entry?.teenager?.educator?.email;
          const time = entry?.evaluation_time?.name;
          const nameteen =
            entry?.teenager?.first_name + " " + entry?.teenager?.last_name;
          const username = entry?.teenager?.educator?.username;

          console.log(`Sending email for eval ${entry.id} to ${email}`);
          console.log(`days remaining : ${diffDays}`);
          console.log(entry);
          try {
            await strapi.plugins["email"].services.email.send({
              to: email,
              from: "admin-eval@garelli95.org", // e.g. single sender verification in SendGrid
              subject: `Rappel de l'évaluation à faire pour ${nameteen}`,
              //   text: "coucou", // Replace with a valid field ID
              replyTo: "no-reply@garelli95.org",
              html: `
              <p> Ceci est un email automatique</p>
            <p> bonjour ${username}, </p>
             <p> Ceci est un rappel pour faire l'évaluation de ${time} de ${nameteen} </p>
             <p> Elle doit avoir lieu dans ${diffDays} jours </p>
             <p> Vous pouvez la réaliser sur le lien suivant 
             <a href="https://acquisgarelli.netlify.app/">Evaluation des acquis</a>
             </p>
             `,
            });
            await strapi.entityService.update(
              "api::evaluation.evaluation",
              entry.id,
              {
                data: {
                  emailsent: true,
                },
              }
            );

            console.log("sent with success");
          } catch (err) {
            console.log("sending email error, email not sent");
            console.log(err);
          }
        }
      });
    },
    options: {
      rule: process.env.CRONFREQUENCY,
    },
  },
};
