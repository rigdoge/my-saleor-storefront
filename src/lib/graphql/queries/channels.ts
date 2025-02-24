import { gql } from 'graphql-request'

export const CHANNELS_QUERY = gql`
  query {
    channels {
      id
      name
      slug
      currencyCode
      isActive
      defaultCountry {
        code
        country
      }
    }
  }
` 