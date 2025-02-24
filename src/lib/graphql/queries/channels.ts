import { gql } from 'graphql-request'

export const CHANNELS_QUERY = gql`
  query GetChannel($slug: String!) {
    channel(slug: $slug) {
      id
      name
      slug
      currencyCode
      defaultCountry {
        code
        country
      }
    }
  }
` 