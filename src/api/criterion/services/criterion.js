'use strict';

/**
 * criterion service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::criterion.criterion');
