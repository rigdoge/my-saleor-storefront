import { CodegenConfig } from '@graphql-codegen/cli'

// 从.env文件中读取API URL，如果不存在则使用硬编码的URL
const apiUrl = process.env.NEXT_PUBLIC_API_URI || 'https://api.saleor.tschenfeng.com/graphql/'

const config: CodegenConfig = {
  schema: apiUrl,
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    './src/lib/graphql/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
        fragmentMasking: false
      }
    },
    './src/lib/graphql/__generated__/types.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-query'
      ],
      config: {
        fetcher: {
          func: '../client-auto#autoGraphqlClient',
          isReactHook: false
        },
        dedupeFragments: true,
        skipTypename: false,
        withHooks: true,
        withHOC: false,
        withComponent: false,
        exportFragmentSpreadSubTypes: true,
        documentMode: 'documentNode',
        reactQueryVersion: 5
      }
    }
  },
  ignoreNoDocuments: true
}

export default config 