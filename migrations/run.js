const { runMigration } = require('contentful-migration');
const path = require('path');

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV ?? "development"}`,
});

const file = process.argv[process.argv.indexOf("-f") + 1];
if (!file) throw new Error('specify migration file path with -f');

const filePath = path.resolve(file);

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const environmentId = process.env.CONTENTFUL_ENVIRONMENT_ID;
const accessToken = process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN;

const options = {
  filePath,
  spaceId,
  environmentId,
  accessToken,
}
console.log('Applying migration file', file, 'with options', options);

runMigration(options)
  .then(() => console.log('Migration Done!'))
  .catch(console.error)
