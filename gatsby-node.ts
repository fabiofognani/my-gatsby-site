import fs from 'fs';
import { GatsbyNode } from 'gatsby';

export const createSchemaCustomization: GatsbyNode["createPages"] = ({ actions }) => {
  const { createTypes } = actions

  const schema = fs.readFileSync('src/gql-schema.gql').toString();

  createTypes(schema)
};
