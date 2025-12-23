const tsconfig = require('./tsconfig.json');
const { pathsToModuleNameMapper } = require('ts-jest');

const { compilerOptions } = tsconfig;

const moduleNameMapper = {
  '^(\\.{1,2}/.*)\\.m?js$': '$1',
  ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
};

module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  testPathIgnorePatterns: ['<rootDir>/src/__tests__/__helpers__'],
  coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/src/__tests__/__helpers__/'],
  transformIgnorePatterns: [
    '/node_modules/(?!(abort-controller|event-target-shim|@redocly/openapi-core)/.*)',
  ],
  moduleFileExtensions: ['mts', 'mjs', 'ts', 'js', 'json'],
  transform: {
    '^.+\\.m?(t|j)s$': '@swc/jest',
  },
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 40,
      lines: 40,
      statements: 40,
    },
  },
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'coverage', outputName: 'junit.xml' }],
  ],
};
