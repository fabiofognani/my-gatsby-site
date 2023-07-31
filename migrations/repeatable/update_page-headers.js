const utils = require('../utils');

const pageComponents =  utils.getModulesConfig('pages');
const headerComponents = utils.getModulesConfig('headers');

module.exports = function(migration, context) {
  pageComponents.forEach((pageComponentConfig) => {
    const ctype = migration.editContentType(pageComponentConfig.contentful_id)

    const headerField = ctype.editField('header')      
    headerField
      .name('Header')
      .type('Link')
      .linkType('Entry')
      .validations([
        {
          "linkContentType": headerComponents.map(headerConfig => headerConfig.contentful_id),
        }
      ])
  });
};
