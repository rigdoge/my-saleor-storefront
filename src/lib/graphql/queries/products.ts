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
      attributes {
        attribute {
          name
          slug
        }
        values {
          name
          slug
        }
      }
      metadata {
        key
        value
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
        discount {
          gross {
            amount
            currency
          }
        }
      }
      category {
        id
        name
        slug
        ancestors(first: 5) {
          edges {
            node {
              id
              name
              slug
            }
          }
        }
      }
      collections {
        id
        name
        slug
      }
      isAvailable
      variants {
        id
        name
        sku
        attributes {
          attribute {
            name
            slug
          }
          values {
            name
            slug
          }
        }
        media {
          url
          alt
          type
        }
        quantityAvailable
        pricing {
          price {
            gross {
              amount
              currency
            }
          }
          discount {
            gross {
              amount
              currency
            }
          }
        }
      }
      seoDescription
      seoTitle
    }
  }
` 