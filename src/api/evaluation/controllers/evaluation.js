"use strict";

/**
 * evaluation controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::evaluation.evaluation",
  ({ strapi }) => ({
    async addanswer(ctx) {
      // Extract parameters from the request
      const { params, request } = ctx;
      // @ts-ignore
      const { body } = request;
      const { id } = params;

      let recordToUpdate = await strapi.entityService.findOne(
        "api::evaluation.evaluation",
        id
      );
      if (!recordToUpdate) {
        return ctx.notFound("Record not found");
      }
      const answers = recordToUpdate.answers;
      const key = body?.data?.key;
      const value = body?.data?.value;

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
      return result;
    },
  })
);
