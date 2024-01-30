'use strict';

/**
 * teenager service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::teenager.teenager');
