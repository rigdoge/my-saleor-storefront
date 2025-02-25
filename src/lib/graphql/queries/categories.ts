import { gql } from 'graphql-request'

export const CATEGORIES_QUERY = gql`
  query Categories($first: Int!, $channel: String!) {
    categories(first: $first, level: 0) {
      edges {
        node {
          id
          name
          slug
          description
          parent {
            id
          }
          backgroundImage {
            url
            alt
          }
          children(first: 100) {
            edges {
              node {
                id
                name
                slug
                description
                parent {
                  id
                }
                backgroundImage {
                  url
                  alt
                }
                products(first: 0, channel: $channel) {
                  totalCount
                }
              }
            }
            totalCount
          }
          products(first: 0, channel: $channel) {
            totalCount
          }
        }
      }
      totalCount
    }
  }
`

export const CATEGORY_BY_SLUG_QUERY = gql`
  query CategoryBySlug($slug: String!, $channel: String!) {
    category(slug: $slug) {
      id
      name
      slug
      description
      backgroundImage {
        url
        alt
      }
      ancestors(first: 5) {
        edges {
          node {
            id
            name
            slug
          }
        }
      }
      children(first: 100) {
        edges {
          node {
            id
            name
            slug
            description
            backgroundImage {
              url
              alt
            }
            products(first: 0, channel: $channel) {
              totalCount
            }
          }
        }
        totalCount
      }
      products(first: 0, channel: $channel) {
        totalCount
      }
    }
  }
`

export const CATEGORY_BY_ID_QUERY = gql`
  query CategoryById($id: ID!, $channel: String!) {
    category(id: $id) {
      id
      name
      slug
      description
      backgroundImage {
        url
        alt
      }
      parent {
        id
        name
        slug
      }
      children(first: 100) {
        edges {
          node {
            id
            name
            slug
            description
            products(first: 0, channel: $channel) {
              totalCount
            }
          }
        }
        totalCount
      }
      products(first: 0, channel: $channel) {
        totalCount
      }
    }
  }
` 