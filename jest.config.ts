import type { Config } from 'jest';
// @ts-ignore
import tsconfig from './tsconfig.json' with { type: "json" }
import { pathsToModuleNameMapper } from 'ts-jest'

const { compilerOptions } = tsconfig;

const moduleNameMapper = {
  '^(\\.{1,2}/.*)\\.js$': '$1',
  ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
}

const config: Config = {
  // ESM preset for TS modules, CJS for legacy JS
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  testPathIgnorePatterns: ['<rootDir>/src/__tests__/__helpers__'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/__tests__/__helpers__/',
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts$': '@swc/jest',
  },
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 84,
      functions: 100,
      lines: 90,
      statements: 90,
    }
  },
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'coverage', outputName: 'junit.xml' }],
  ],
};

export default config;
