import { gql } from 'graphql-request';

// 获取所有菜单列表
export const MENUS_QUERY = gql`
  query Menus {
    menus(first: 10) {
      edges {
        node {
          id
          name
          slug
          items {
            id
            name
            url
            category {
              id
              name
              slug
              backgroundImage {
                url
                alt
              }
            }
            collection {
              id
              name
              slug
              backgroundImage {
                url
                alt
              }
            }
            page {
              id
              title
              slug
            }
            children {
              id
              name
              url
              category {
                id
                name
                slug
              }
              collection {
                id
                name
                slug
              }
              page {
                id
                title
                slug
              }
              children {
                id
                name
                url
                category {
                  id
                  name
                  slug
                }
                collection {
                  id
                  name
                  slug
                }
                page {
                  id
                  title
                  slug
                }
              }
            }
          }
        }
      }
    }
  }
`;

// 获取特定菜单（通过slug）
export const MENU_BY_SLUG_QUERY = gql`
  query MenuBySlug($slug: String!) {
    menu(slug: $slug) {
      id
      name
      slug
      items {
        id
        name
        url
        category {
          id
          name
          slug
          description
          backgroundImage {
            url
            alt
          }
        }
        collection {
          id
          name
          slug
          backgroundImage {
            url
            alt
          }
        }
        page {
          id
          title
          slug
          content
        }
        children {
          id
          name
          url
          category {
            id
            name
            slug
            description
            backgroundImage {
              url
              alt
            }
          }
          collection {
            id
            name
            slug
            backgroundImage {
              url
              alt
            }
          }
          page {
            id
            title
            slug
          }
          children {
            id
            name
            url
            category {
              id
              name
              slug
            }
            collection {
              id
              name
              slug
            }
            page {
              id
              title
              slug
            }
          }
        }
      }
    }
  }
`;

// 获取主菜单（通常是顶部导航菜单）
export const MAIN_MENU_QUERY = gql`
  query MainMenu {
    menu(slug: "main-menu") {
      id
      name
      slug
      items {
        id
        name
        url
        category {
          id
          name
          slug
          description
          backgroundImage {
            url
            alt
          }
        }
        collection {
          id
          name
          slug
          backgroundImage {
            url
            alt
          }
        }
        page {
          id
          title
          slug
        }
        children {
          id
          name
          url
          category {
            id
            name
            slug
            description
            backgroundImage {
              url
              alt
            }
          }
          collection {
            id
            name
            slug
            backgroundImage {
              url
              alt
            }
          }
          page {
            id
            title
            slug
          }
          children {
            id
            name
            url
            category {
              id
              name
              slug
            }
            collection {
              id
              name
              slug
            }
            page {
              id
              title
              slug
            }
          }
        }
      }
    }
  }
`;

// 获取导航菜单（navbar）
export const NAVBAR_MENU_QUERY = gql`
  query NavbarMenu {
    menu(slug: "navbar") {
      id
      name
      slug
      items {
        id
        name
        url
        category {
          id
          name
          slug
          description
          backgroundImage {
            url
            alt
          }
        }
        collection {
          id
          name
          slug
          backgroundImage {
            url
            alt
          }
        }
        page {
          id
          title
          slug
        }
        children {
          id
          name
          url
          category {
            id
            name
            slug
            description
            backgroundImage {
              url
              alt
            }
          }
          collection {
            id
            name
            slug
            backgroundImage {
              url
              alt
            }
          }
          page {
            id
            title
            slug
          }
          children {
            id
            name
            url
            category {
              id
              name
              slug
            }
            collection {
              id
              name
              slug
            }
            page {
              id
              title
              slug
            }
          }
        }
      }
    }
  }
`; 