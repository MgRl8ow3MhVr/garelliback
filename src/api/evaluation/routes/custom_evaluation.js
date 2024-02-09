module.exports = {
  routes: [
    {
      // Path defined with an URL parameter
      method: "POST",
      path: "/evaluations/addanswer/:id",
      handler: "evaluation.addanswer",
    },
  ],
};
