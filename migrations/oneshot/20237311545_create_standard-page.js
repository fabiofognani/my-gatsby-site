module.exports = function(migration, context) {
  const ctype = migration.createContentType('standard-page')
  ctype
    .name('Standard Page')
    .description('Standard page')

   ctype
     .createField('title')
     .name('Title')
     .type('Symbol');
  
  ctype.createField('header')
    .name('Header')
    .type('Link')
    .linkType('Entry')
};