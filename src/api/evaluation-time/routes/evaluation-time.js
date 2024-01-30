'use strict';

/**
 * evaluation-time router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::evaluation-time.evaluation-time');
