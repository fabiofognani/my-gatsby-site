const { runMigration } = require('contentful-migration');
const path = require('path');
const prompt = require('select-prompt');
const { getFilesInDir } = require('./utils');

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV ?? "development"}`,
});

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const environmentId = process.env.CONTENTFUL_ENVIRONMENT_ID;
const accessToken = process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN;

function runMigrationFile(fileName) {
  const filePath = path.resolve(fileName);
  const options = {
    filePath,
    spaceId,
    environmentId,
    accessToken,
  }
  console.log('Applying migration file', fileName, 'with options', options);

  runMigration(options)
    .then(() => console.log('Migration Done!'))
    .catch(console.error)
}

const file = process.argv.indexOf("-f") > -1
  ? process.argv[process.argv.indexOf("-f") + 1]
  : null;

if (file) {
  runMigrationFile(file);
} else {
  const availableMigrations = getFilesInDir('./migrations/oneshot')
    .map(filePath => filePath.split(path.sep).pop())
    .filter(fileName => fileName !== 'index.js')
    .map(fileName => ({
      title: fileName,
      value: fileName,
    }))
    .reverse();
      
  return prompt('What migration do you want to run?', availableMigrations, { cursor: 0 })
    .on('submit', (v) => {
      runMigrationFile(`./migrations/oneshot/${v}`)
    })
}