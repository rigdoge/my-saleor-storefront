import { gql } from 'graphql-request'

export const SEARCH_PRODUCTS_QUERY = gql`
  query SearchProducts(
    $search: String!
    $channel: String!
    $first: Int
    $after: String
    $sortBy: ProductOrder
    $filter: ProductFilterInput
  ) {
    products(
      filter: {
        search: $search,
        ...($filter || {})
      }
      channel: $channel
      first: $first
      after: $after
      sortBy: $sortBy
    ) {
      edges {
        node {
          id
          name
          description
          slug
          thumbnail {
            url
            alt
          }
          pricing {
            priceRange {
              start {
                gross {
                  amount
                  currency
                }
              }
            }
          }
          category {
            id
            name
            slug
          }
          collections {
            name
          }
          isAvailable
          variants {
            id
            name
            quantityAvailable
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`

export const SEARCH_SUGGESTIONS_QUERY = gql`
  query SearchSuggestions(
    $search: String!
    $channel: String!
    $first: Int = 5
  ) {
    products(
      filter: { search: $search }
      channel: $channel
      first: $first
    ) {
      edges {
        node {
          id
          name
          slug
          thumbnail {
            url
            alt
          }
          category {
            name
          }
        }
      }
    }
  }
` 