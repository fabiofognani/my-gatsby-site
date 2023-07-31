module.exports = function(migration, context) {
  migration.deleteContentType('pippo')
  const ctype = migration.createContentType('pippo')
  ctype
    .name('Pippo')
    .description('Yuk yuk')

  ctype
    .createField('fullName')
    .name('Full name')
    .type('Symbol')
    .required(true)

  ctype
    .createField('twitter')
    .name('Twitter')
    .type('Symbol')
    .validations([
      { "unique": true },
      { "regexp": 
        { "pattern": "^\\w[\\w.-]*@([\\w-]+\\.)+[\\w-]+$" }
      }
    ])
  
  ctype.createField('header')
    .name('Header')
    .type('Link')
    .linkType('Entry')
    // .validations([
    //   {
    //     "linkContentType": [] // empty array will make the migration fail
    //   }
    // ])
};