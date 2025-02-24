import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    './src/lib/graphql/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
        fragmentMasking: false
      }
    }
  },
  ignoreNoDocuments: true
}

export default config 