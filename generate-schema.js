const fs = require('fs');

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV ?? 'development'}`,
});

const isVerbose = process.argv.includes('--verbose')

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const environmentId = process.env.CONTENTFUL_ENVIRONMENT_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

const baseUrl = 'https://cdn.contentful.com';
const url = `${baseUrl}/spaces/${spaceId}/environments/${environmentId}/content_types?access_token=${accessToken}`;

async function getSchema() { 
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function transformContentTypesToGQL(schema) {
  return schema.items.map(transformContentTypeToGQL)
    .join('\n\n');
}

function transformContentTypeToGQL(contentTypeConfig) {
  const gqlContentTypeName = toGQLContentTypeName(contentTypeConfig.sys.id);
  return [
    isVerbose && toGQLContentTypeHeader(contentTypeConfig),
    `type ${gqlContentTypeName} implements Node {${
      transformContentTypeFieldsToGQL(contentTypeConfig)
    }\n}`,
  ].filter(Boolean).join('\n');
}

function toGQLContentTypeHeader(contentTypeConfig) {
  return [
    `# ${contentTypeConfig.name}`,
    contentTypeConfig.description && `# ${contentTypeConfig.description}`,
  ].filter(Boolean).join('\n');
}

function toGQLContentTypeName(name) {
  return `Contentful${capitalized(name)}`;
}

function capitalized(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function transformContentTypeFieldsToGQL(contentTypeConfig) {
  return contentTypeConfig.fields.map(transformFieldConfigToGQL)
    .join('');
}

function transformFieldConfigToGQL(fieldConfig) {
  return [
    isVerbose && `\n\t# ${fieldConfig.name}`,
    `\n\t${fieldConfig.id}: ${getGQLFieldType(fieldConfig)}`,
  ].filter(Boolean).join('');
}

/**
 * Returns full type definition for a field, including required (!) and array ([...]) modifiers 
 */
function getGQLFieldType(fieldConfig) {
  let type = getGQLFieldBasicType(fieldConfig);
  if (fieldConfig.required) {
    const isUnionType = / \| /g.test(type);
    const isArrayType = /^\[(.*)\]$/.test(type);
    if (isUnionType && !isArrayType) {
      type = `(${type})`;
    }
    type = `${type}!`;
  }
  return type;
}

/**
 * See https://www.contentful.com/developers/docs/concepts/data-model/
 */
function getGQLFieldBasicType(fieldConfig) {
  const fieldType = fieldConfig.type;
  switch (fieldType) {
    case 'Text':
    case 'Symbol':
    case 'Date':
      return 'String';
    case 'Integer':
      return 'Int';
    case 'Number':
      return 'Float';
    case 'Link': return getFieldLinkType(fieldConfig);
    case 'Array': return `[${getGQLFieldType(fieldConfig.items)}]`;
    default: return fieldType;
  }
}

function getFieldLinkType(fieldConfig) {
  if (fieldConfig.validations) {
    // TODO check multiple items with linkContentType (will it happen?)
    const linkContentTypeItem = fieldConfig.validations.find(validation => {
      return validation.linkContentType;
    });
    // TODO check other cases (will it happen?)
    if (linkContentTypeItem && linkContentTypeItem.linkContentType) {
      return linkContentTypeItem.linkContentType.map(toGQLContentTypeName).join(' | ');
    }
  }
  return fieldConfig.linkType;
}

/**
 * Contentful types that must be added to the schema definitions,
 * otherwise createTypes will throw an error.
 */
const builtInTypes = 
`type RichText {
  nodeType: String
}

type Location {
  lat: Float!
  lon: Float!
}

type Object {
  fakeFieldForCustomSchemaDefinition: Boolean
}

type Asset {
  title: String
}
`

getSchema()
  .then(transformContentTypesToGQL)
  .then(customContentTypes => {
    const finalSchema = [
      builtInTypes,
      customContentTypes,
      '', // empty line
    ].join('\n');

    fs.writeFileSync('./src/gql-schema.gql', finalSchema);
  });
