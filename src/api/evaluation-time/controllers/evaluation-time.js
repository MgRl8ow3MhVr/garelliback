'use strict';

/**
 * evaluation-time controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::evaluation-time.evaluation-time');
