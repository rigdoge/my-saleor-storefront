import { gql } from 'graphql-request'

export const PRODUCTS_QUERY = gql`
  query Products($first: Int!, $channel: String!) {
    products(first: $first, channel: $channel) {
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
          media {
            url
            alt
            type
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

export const PRODUCT_BY_ID_QUERY = gql`
  query ProductById($id: ID!, $channel: String!) {
    product(id: $id, channel: $channel) {
      id
      name
      description
      slug
      thumbnail {
        url
        alt
      }
      media {
        url
        alt
        type
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
        pricing {
          price {
            gross {
              amount
              currency
            }
          }
        }
      }
    }
  }
`

export const PRODUCT_BY_SLUG_QUERY = gql`
  query ProductBySlug($slug: String!, $channel: String!) {
    product(slug: $slug, channel: $channel) {
      id
      name
      description
      slug
      thumbnail {
        url
        alt
      }
      media {
        url
        alt
        type
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
        pricing {
          price {
            gross {
              amount
              currency
            }
          }
        }
      }
    }
  }
` 