"use strict";

/**
 * evaluation controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::evaluation.evaluation",
  ({ strapi }) => ({
    async addanswer(ctx) {
      await this.validateQuery(ctx);
      const params = await this.sanitizeQuery(ctx);
      const { cat_index, crit_index, value } = params;
      const cat_index_num = Number(cat_index);
      const crit_index_num = Number(crit_index);
      // Extract parameters from the request
      const id = ctx.params.id;

      let recordToUpdate = await strapi.entityService.findOne(
        "api::evaluation.evaluation",
        id
      );
      if (!recordToUpdate) {
        return ctx.notFound("Record not found");
      }

      const answers = recordToUpdate.answers;
      const progression = recordToUpdate.progression;

      // check if all data are accessible
      if (
        isNaN(cat_index_num) ||
        isNaN(crit_index_num) ||
        value === undefined ||
        !answers[cat_index_num] ||
        !answers[cat_index_num]?.criteria[crit_index_num]
      ) {
        return ctx.badRequest("wrong argument or missing argument");
      }

      // insert new answer
      const criteria = answers[cat_index_num].criteria;
      criteria[crit_index_num].answer = value;

      // calculate new progression
      const answered_num = criteria.reduce(
        (acc, current) => acc + !!current.answer,
        0
      );
      const new_progression = criteria.length
        ? Math.floor((answered_num / criteria.length) * 100)
        : 0;
      progression[cat_index_num].percent = new_progression;

      // new latest
      const latest = { category: cat_index_num, criterion: crit_index_num };

      // now update
      const result = await strapi.entityService.update(
        "api::evaluation.evaluation",
        id,
        {
          data: {
            answers,
            progression,
            latest,
          },
        }
      );
      const sanitizedResults = await this.sanitizeOutput(result, ctx);
      return this.transformResponse(sanitizedResults);
    },
    async create(ctx) {
      const res = await strapi.service("api::category.category").find({
        populate: {
          criteria: {
            sort: "order:asc",
            fields: ["name", "weight", "scale"],
            populate: {
              icon: {
                fields: ["url"],
              },
            },
          },
          icon: {
            fields: ["url"],
          },
          icon2: {
            fields: ["url"],
          },
        },
        fields: ["name"],
        sort: "order",
      });
      const allCats = res?.results;
      const progression = [];

      allCats.forEach((cat) => {
        progression.push({
          name: cat.name,
          id: cat.id,
          percent: 0,
          url: cat.icon?.url,
          url2: cat.icon2?.url,
        });
      });

      // @ts-ignore
      ctx.request.body.data = {
        // @ts-ignore
        ...ctx.request.body.data,
        progression,
        answers: allCats,
        status: "started",
      };
      const result = await super.create(ctx);

      return result;
    },
  })
);
