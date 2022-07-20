import { NormalizedSchema, PackageJson } from '../../types';

export const packageJson = (options: NormalizedSchema): PackageJson => ({
  name: `@${options.workspaceName}/${options.importPath}`,
  private: true,
  version: '1.0.0',
  license: 'UNLICENSED',
  scripts: {
    deploy: 'serverless deploy',
    'deploy-production': 'serverless deploy --stage production',
    'deploy-staging': 'serverless deploy --stage staging',
    deployedCommit: 'serverless deployedCommit',
    'lint-fix': 'yarn linter-base-config --fix',
    'lint-fix-all': 'yarn lint-fix .',
    'linter-base-config': 'eslint --ext=js,ts',
    remove: 'serverless remove',
    'remove-production': 'serverless remove --stage production',
    'remove-staging': 'serverless remove --stage staging',
    'sls-info': 'serverless info --verbose',
    test: 'yarn test-linter && yarn test-type && yarn test-unit && yarn test-circular',
    'test-circular': 'yarn depcruise --validate .dependency-cruiser.js .',
    'test-linter': 'yarn linter-base-config .',
    'test-type': 'tsc --noEmit',
    'test-unit': 'jest --runInBand --collectCoverage --logHeapUsage',
  },
  dependencies: {
    [`@${options.workspaceName}/serverless-configuration`]: 'workspace:*',
    '@swarmion/serverless-helpers': 'latest',
  },
  devDependencies: {
    [`@${options.workspaceName}/configuration`]: 'workspace:*',
    [`@${options.workspaceName}/core-contracts`]: 'workspace:*',
    '@serverless/typescript': 'latest',
    '@types/jest': 'latest',
    '@types/node': 'latest',
    'dependency-cruiser': 'latest',
    esbuild: 'latest',
    eslint: 'latest',
    jest: 'latest',
    serverless: 'latest',
    'serverless-esbuild': 'latest',
    'serverless-iam-roles-per-function': 'latest',
    'ts-jest': 'latest',
    'ts-node': 'latest',
    typescript: 'latest',
  },
});
