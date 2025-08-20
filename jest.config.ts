import type { Config } from 'jest';

const config: Config = {
  // ESM preset for TS modules, CJS for legacy JS
  preset: 'ts-jest/presets/default-esm',
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
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'ESNext',
          target: 'ES2019',
        },
      },
    ],
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
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
