module.exports = function(migration, context) {  
  const ctype = migration.createContentType('standard-header')
  ctype
    .name('Standard Header')
    .description('Standard header')

  ctype
    .createField('link')
    .name('Link')
    .type('Symbol')
};
