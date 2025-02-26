import { gql } from 'graphql-request'

export const PRODUCTS_QUERY = gql`
  query Products(
    $first: Int!
    $after: String
    $channel: String!
    $filter: ProductFilterInput
    $sortBy: ProductOrder
  ) {
    products(
      first: $first
      after: $after
      channel: $channel
      filter: $filter
      sortBy: $sortBy
    ) {
      edges {
        node {
          id
          name
          description
          slug
          productType {
            id
            name
            kind
          }
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
          variants {
            id
            name
            quantityAvailable
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
          }
          isAvailable
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
      variants {
        id
        name
        quantityAvailable
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
      }
      isAvailable
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
      productType {
        id
        name
        kind
      }
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

// 简化版的产品查询，用于前端展示
export const GET_PRODUCTS = gql`
  query GetProducts(
    $first: Int!
    $after: String
    $filter: ProductFilterInput
    $sortBy: ProductOrder
    $channel: String!
  ) {
    products(
      first: $first
      after: $after
      filter: $filter
      sortBy: $sortBy
      channel: $channel
    ) {
      edges {
        node {
          id
          name
          description
          slug
          price: pricing {
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
          thumbnail {
            url
            alt
          }
          category {
            id
            name
            slug
          }
          isAvailable
          metadata {
            key
            value
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

// Define sort and filter types
export type ProductSortField = 'PRICE' | 'NAME' | 'RANK' | 'DATE'
export type ProductOrderDirection = 'ASC' | 'DESC'

export interface ProductSortInput {
  field: ProductSortField
  direction: ProductOrderDirection
}

export interface ProductFilterInput {
  isAvailable?: boolean;
  search?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  categories?: string[];
  attributes?: Array<{
    slug: string;
    values: string[];
  }>;
  [key: string]: any; // 添加索引签名
}

// Convert URL parameters to GraphQL filter conditions
export function getProductFilters(searchParams: URLSearchParams | Record<string, string>): {
  filter: ProductFilterInput;
  sortBy: ProductSortInput;
} {
  // Convert searchParams to a regular object if it's URLSearchParams
  const params = searchParams instanceof URLSearchParams 
    ? Object.fromEntries(searchParams.entries()) 
    : searchParams

  const filter: ProductFilterInput = {
    isAvailable: undefined,
    search: undefined,
    price: undefined,
    categories: undefined,
    attributes: undefined
  }
  
  // Search keyword
  if (params.search) {
    filter.search = params.search
  }
  
  // Price range
  const minPrice = params.minPrice
  const maxPrice = params.maxPrice
  if (minPrice || maxPrice) {
    filter.price = {}
    if (minPrice) filter.price.gte = parseFloat(minPrice)
    if (maxPrice) filter.price.lte = parseFloat(maxPrice)
  }

  // Brand filter
  const brands = params.brands?.split(',').filter(Boolean)
  if (brands?.length) {
    filter.attributes = [
      ...(filter.attributes || []),
      { slug: 'brand', values: brands }
    ]
  }

  // Color filter
  const colors = params.colors?.split(',').filter(Boolean)
  if (colors?.length) {
    filter.attributes = [
      ...(filter.attributes || []),
      { slug: 'color', values: colors }
    ]
  }

  // Size filter
  const sizes = params.sizes?.split(',').filter(Boolean)
  if (sizes?.length) {
    filter.attributes = [
      ...(filter.attributes || []),
      { slug: 'size', values: sizes }
    ]
  }

  // Stock status
  if (params.inStock === 'true') {
    filter.isAvailable = true
  }

  // Sorting
  let sortBy: ProductSortInput = { field: 'RANK', direction: 'DESC' } // Default sorting
  
  if (params.sort) {
    switch (params.sort) {
      case 'price_asc':
        sortBy = { field: 'PRICE', direction: 'ASC' }
        break
      case 'price_desc':
        sortBy = { field: 'PRICE', direction: 'DESC' }
        break
      case 'newest':
        sortBy = { field: 'DATE', direction: 'DESC' }
        break
      case 'popular':
        sortBy = { field: 'RANK', direction: 'DESC' }
        break
      default:
        sortBy = { field: 'RANK', direction: 'DESC' }
    }
  }

  // Clean up undefined values
  const cleanFilter = Object.fromEntries(
    Object.entries(filter).filter(([_, value]) => value !== undefined)
  ) as ProductFilterInput;

  return { filter: cleanFilter, sortBy }
} 