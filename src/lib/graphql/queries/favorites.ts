import { gql } from 'graphql-request'

export const USER_FAVORITES_QUERY = gql`
  query UserFavorites {
    me {
      favorites {
        edges {
          node {
            id
            name
            slug
            description
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
            isAvailable
          }
        }
      }
    }
  }
`

export const ADD_TO_FAVORITES_MUTATION = gql`
  mutation AddToFavorites($productId: ID!) {
    addToFavorites(productId: $productId) {
      success
      errors {
        field
        message
      }
    }
  }
`

export const REMOVE_FROM_FAVORITES_MUTATION = gql`
  mutation RemoveFromFavorites($productId: ID!) {
    removeFromFavorites(productId: $productId) {
      success
      errors {
        field
        message
      }
    }
  }
` 