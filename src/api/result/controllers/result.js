"use strict";

/**
 * result controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::result.result", ({ strapi }) => ({
  async produceResults(ctx) {
    await this.validateQuery(ctx);
    const params = await this.sanitizeQuery(ctx);
    const id = ctx.params.id;

    let evaluation = await strapi.entityService.findOne(
      "api::evaluation.evaluation",
      id,
      {
        fields: ["answers"],
        populate: {
          teenager: { populate: { entity: true } },
          evaluation_time: {
            fields: ["name"],
          },
          entity: {
            fields: ["name"],
          },
        },
      }
    );
    if (!evaluation) {
      return ctx.notFound("Record not found");
    }

    console.log("EVAL");

    const entity = evaluation.teenager?.entity?.id;
    const teenager = evaluation.teenager;
    const evaluation_time = evaluation.evaluation_time.id;
    for (const ev in evaluation.answers) {
      const cat = evaluation.answers[ev];
      console.log(cat);
      const result = await strapi.entityService.create("api::result.result", {
        data: {
          evaluation: id,
          category: cat.name,
          result: 1.1,
          evaluation_time,
          entity,
          teenager: teenager.id,
          teenager_name: teenager.first_name + teenager.last_name,
        },
      });
    }
    // ET LE TOTAL ICI

    return true;
  },
}));
