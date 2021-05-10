'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  populate: async (ctx)=>{
    console.log('Starting to populate...');

    const options = {
      page: '1',
      sort: 'popularity',
      ...ctx.query
    };
    await strapi.services.game.populate(options);

    ctx.send('Finished populating!');
  }
};
