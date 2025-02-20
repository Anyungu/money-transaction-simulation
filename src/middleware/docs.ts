import { apiReference } from '@scalar/express-api-reference'

export const = docs => (
  '/reference',
  apiReference({
    spec: {
      // Put your OpenAPI url here:
      url: '/openapi.json',
    },
  }),
)