'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */
const axios = require('axios');


/**
 * Como alguns dados são consumidos dinamicamente na página
 * Vamos ter que montar a página e fazer o scrapper com JSDOM
 */
async function getGameInfo(slug){
  const jsdom = require('jsdom');
  const { JSDOM } = jsdom;
  const body = await axios.get(`https://www.gog.com/game/${slug}`);

  // montar o dom
  const dom = new JSDOM(body.data);

  const description = dom.window.document.querySelector('.description');

  return {
    rating:'BR0',
    short_description: description.textContent.slice(0,160),
    description: description.innerHTML
  };
}


module.exports = {
  populate: async (params) =>{
    const gogApiUrl = 'https://www.gog.com/games/ajax/filtered?mediaType=game&page=1&sort=popularity';

    const {data:{products}}= await axios.get(gogApiUrl);


    console.log(await getGameInfo(products[0].slug));
    return products;
  }
};
