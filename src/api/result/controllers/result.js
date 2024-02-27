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

    let ev = await strapi.entityService.findOne(
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
    if (!ev) {
      return ctx.notFound("Record not found");
    }
    const resultToSend = [];
    for (const i in ev.answers) {
      const cat = ev.answers[i];
      const criteria = cat.criteria;
      let sumWeight = 0;
      let accumulator = 0;
      for (const j in criteria) {
        const c = criteria[j];
        sumWeight += c.weight;
        accumulator +=
          !isNaN(c.answer) && c.scale ? (c.answer * c.weight) / c.scale : 0;
      }
      const score =
        sumWeight !== 0 ? Math.round((accumulator / sumWeight) * 100) / 100 : 0;
      const result = await strapi.entityService.create("api::result.result", {
        data: {
          evaluation: id,
          category: cat.name,
          result: score,
          evaluation_time: ev.evaluation_time.name,
          entity: ev.teenager?.entity?.name,
          teenager_id: ev.teenager.id,
          teenager_name: ` ${ev.teenager.first_name} ${ev.teenager.last_name}`,
          teenager_entry: ev.teenager.entry_date,
          teenager_exit: ev.teenager.exit_date,
        },
      });
      resultToSend.push(result);
    }
    // return true;
    const sanitizedResults = await this.sanitizeOutput(resultToSend, ctx);
    return this.transformResponse(sanitizedResults);
  },
}));
