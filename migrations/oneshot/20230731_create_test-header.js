module.exports = function(migration, context) {
  // migration.deleteContentType('test-header')
  const ctype = migration.createContentType('test-header')
  ctype
    .name('Test Header')
    .description('This is a test header')

  ctype
    .createField('link')
    .name('Link')
    .type('Symbol')
    .required(true)
};
