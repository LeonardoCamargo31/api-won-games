'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */
const axios = require('axios');
const slugify = require('slugify');

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

/**
 * Buscar dados já criados para evitar erro de item duplicado
 */
async function getByName(name, entityName){
  const item = await strapi.services[entityName].find({name});
  return item.length ? item[0]:null;
}

/**
 * Criar dado
 */
async function create(name, entityName){
  const item = await getByName(name,entityName);

  if(!item){
    return await strapi.services[entityName].create({
      name,
      slug: slugify(name,{ lower:true })
    });
  }
}

module.exports = {
  populate: async (params) =>{
    const gogApiUrl = 'https://www.gog.com/games/ajax/filtered?mediaType=game&page=1&sort=popularity';

    const {data:{products}}= await axios.get(gogApiUrl);

    console.log(products[0].slug);

    await create(products[0].publisher, 'publisher');
    await create(products[0].developer, 'developer');

    return products;
  }
};
