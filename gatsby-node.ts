const fs = require('fs');

exports.createSchemaCustomization = ({ actions }: any) => {
  const { createTypes } = actions

  const schema = fs.readFileSync('src/gql-schema.gql').toString();

  createTypes(schema)
};
