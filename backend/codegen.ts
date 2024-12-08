import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'src/schema/*.graphql',
  config: {
    namingConvention: 'keep',
  },
  generates: {
    'src/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
};

export default config;
