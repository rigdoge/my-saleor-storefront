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
            payments {
              id
              gateway
              paymentMethodType
              chargeStatus
            }
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
      billingAddress {
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
      total {
        gross {
          amount
          currency
        }
      }
      subtotal {
        gross {
          amount
          currency
        }
      }
      shippingPrice {
        gross {
          amount
          currency
        }
      }
      payments {
        id
        gateway
        paymentMethodType
        chargeStatus
        creditCard {
          brand
          lastDigits
          expMonth
          expYear
        }
      }
      lines {
        id
        productName
        variantName
        quantity
        thumbnail {
          url
          alt
        }
        unitPrice {
          gross {
            amount
            currency
          }
        }
        totalPrice {
          gross {
            amount
            currency
          }
        }
      }
    }
  }
`

// 辅助函数：获取支付方式
export const getPaymentMethod = (order: any) => {
  if (!order.payments || order.payments.length === 0) return '未指定'
  
  const payment = order.payments[0]
  return payment.gateway || payment.paymentMethodType || '未指定'
} 