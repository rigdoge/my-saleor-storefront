import { gql } from 'graphql-request'

export const USER_ORDERS_QUERY = gql`
  query UserOrders($first: Int!) {
    me {
      orders(first: $first) {
        edges {
          node {
            id
            number
            created
            status
            total {
              gross {
                amount
                currency
              }
            }
            lines {
              id
              productName
              productSku
              quantity
              unitPrice {
                gross {
                  amount
                  currency
                }
              }
              thumbnail {
                url
                alt
              }
            }
            shippingAddress {
              firstName
              lastName
              streetAddress1
              streetAddress2
              city
              countryArea
              postalCode
              country {
                code
                country
              }
              phone
            }
            paymentStatus
            paymentMethod
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`

export const ORDER_BY_ID_QUERY = gql`
  query OrderById($id: ID!) {
    order(id: $id) {
      id
      number
      created
      status
      total {
        gross {
          amount
          currency
        }
      }
      lines {
        id
        productName
        productSku
        quantity
        unitPrice {
          gross {
            amount
            currency
          }
        }
        thumbnail {
          url
          alt
        }
      }
      shippingAddress {
        firstName
        lastName
        streetAddress1
        streetAddress2
        city
        countryArea
        postalCode
        country {
          code
          country
        }
        phone
      }
      paymentStatus
      paymentMethod
    }
  }
` 