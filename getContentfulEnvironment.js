const { strict: assert } = require("assert")
const contentfulManagement = require("contentful-management")

const environment = 'development' // process.env.NODE_ENV
require("dotenv").config({
  path: `.env.${environment}`,
})

const { CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN, CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT_ID } = process.env

assert(CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN)
assert(CONTENTFUL_SPACE_ID)
assert(CONTENTFUL_ENVIRONMENT_ID)

const getContentfulEnvironment = () => {
  const contentfulClient = contentfulManagement.createClient({
    accessToken: CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN,
  })

  return contentfulClient
    .getSpace(CONTENTFUL_SPACE_ID)
    .then(space => space.getEnvironment(CONTENTFUL_ENVIRONMENT_ID))
}

module.exports = getContentfulEnvironment