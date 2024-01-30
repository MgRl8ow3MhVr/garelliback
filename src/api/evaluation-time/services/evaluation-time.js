'use strict';

/**
 * evaluation-time service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::evaluation-time.evaluation-time');
