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
      const sanitizedQueryParams = await this.sanitizeQuery(ctx);

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
      const key = String(sanitizedQueryParams?.criteria);
      const value = sanitizedQueryParams?.answer;

      if (key && value) {
        answers[key] = value;
      }
      const result = await strapi.entityService.update(
        "api::evaluation.evaluation",
        1,
        {
          data: {
            answers,
          },
        }
      );
      const sanitizedResults = await this.sanitizeOutput(result, ctx);

      return this.transformResponse(sanitizedResults);
    },
    async create(ctx) {
      const res = await strapi.service("api::category.category").find({
        populate: ["criteria"],
      });
      const allCats = res?.results;

      allCats.sort((a, b) => a.order - b.order);
      // console.log(allCats.results[0].criteria);
      const answers = {};
      allCats.forEach((cat) => {
        delete cat.createdAt;
        delete cat.updatedAt;
        delete cat.publishedAt;
        // answers[cat.name].infos='test'
      });
      console.log(allCats);

      //@ts-ignore
      const body = ctx?.request?.body;
      console.log(body);
      body.data.status = "started";
      // body.data.answers = {}
      // const result = await super.create(ctx);

      // return result;
      return "test";
    },
  })
);
