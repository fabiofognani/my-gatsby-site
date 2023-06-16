const fs = require('fs');

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV ?? 'development'}`,
});

const isVerbose = process.argv.includes('--verbose')
const isDebug = process.argv.includes('--debug')

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const environmentId = process.env.CONTENTFUL_ENVIRONMENT_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

const baseUrl = process.env.CONTENTFUL_HOST ?? 'https://cdn.contentful.com';
const url = `${baseUrl}/spaces/${spaceId}/environments/${environmentId}/content_types?access_token=${accessToken}&limit=1000`;

/**
 * This will hold the union types that cannot be defined inline
 */
const collectedUnions = [];

/**
 * Fetches content model from Contentful and returns it as JSON
 */
async function getSchema() { 
  const response = await fetch(url);
  const data = await response.json();
  if (isDebug) fs.writeFileSync('./src/contentful-schema.json', JSON.stringify(data, null, 2));
  
  if (!data.items) throw new Error(data.message || 'Unknown error')
  return data.items.map(transformContentTypeToGQL)
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
  return contentTypeConfig.fields.map(fieldConfig => (
    transformFieldConfigToGQL(fieldConfig, contentTypeConfig)
  )).join('');
}

function transformFieldConfigToGQL(fieldConfig, contentTypeConfig) {
  return [
    isVerbose && `\n\t# ${fieldConfig.name}`,
    `\n\t${fieldConfig.id}: ${getGQLFieldType(fieldConfig, contentTypeConfig)}`,
  ].filter(Boolean).join('');
}

/**
 * Returns full type definition for a field, including required (!) and array ([...]) modifiers 
 */
function getGQLFieldType(fieldConfig, contentTypeConfig) {
  let type = getGQLFieldBasicType(fieldConfig, contentTypeConfig);
  if (fieldConfig.required) {
    type = `${type}!`;
  }
  return type;
}

function getArrayFieldType(fieldConfig, contentTypeConfig) {
  const type = getGQLFieldType(fieldConfig.items, contentTypeConfig);
  return `[${type}]`
}

/**
 * See https://www.contentful.com/developers/docs/concepts/data-model/
 */
function getGQLFieldBasicType(fieldConfig, contentTypeConfig) {
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
    case 'Link': return getFieldLinkType(fieldConfig, contentTypeConfig);
    case 'Array': return getArrayFieldType(fieldConfig, contentTypeConfig);
    default: return fieldType;
  }
}

function getFieldLinkType(fieldConfig, contentTypeConfig) {
  if (fieldConfig.validations) {
    // TODO check multiple items with linkContentType (will it happen?)
    const linkContentTypeItem = fieldConfig.validations.find(validation => {
      return validation.linkContentType;
    });
    // TODO check other cases (will it happen?)
    if (linkContentTypeItem && linkContentTypeItem.linkContentType) {
      if (linkContentTypeItem.linkContentType.length === 1) {
        // Only 1 possibility: no need for a dedicated union type
        return toGQLContentTypeName(linkContentTypeItem.linkContentType[0]);
      } else {
        // Create a new union type
        const unionTypes = linkContentTypeItem.linkContentType.map(toGQLContentTypeName);
        const unionName =  `Union__${unionTypes.join('__')}`
        collectedUnions.push(`union ${unionName} = ${unionTypes.join(' | ')}`);
        return unionName;
      }
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

type Asset {
  title: String
}

type Object {
  fakeFieldForSchemaDefinition: Boolean
}
`

getSchema()
  .then(customContentTypes => {
    const finalSchema = [
      builtInTypes,
      collectedUnions.join('\n\n'),
      '', // empty line
      customContentTypes,
      '', // empty line
    ].join('\n');

    fs.writeFileSync('./src/gql-schema.gql', finalSchema);
  });
