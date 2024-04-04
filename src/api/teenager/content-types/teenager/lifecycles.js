// module.exports = {
//   async afterCreate(event) {
//     // Connected to "Save" button in admin panel
//     const { result } = event;
//     console.log("trying email");

//     try {
//       await strapi.plugins["email"].services.email.send({
//         to: "pierredevpro@gmail.com",
//         from: "admin-eval@garelli95.org", // e.g. single sender verification in SendGrid
//         subject: "The Strapi Email plugin worked successfully",
//         text: "coucou", // Replace with a valid field ID
//         html: "Hello world!",
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   },
// };
