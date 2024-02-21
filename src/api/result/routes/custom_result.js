module.exports = {
  routes: [
    {
      // Path defined with an URL parameter
      method: "POST",
      path: "/results/produceresults/:id",
      handler: "result.produceResults",
    },
  ],
};
