// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  // ESM preset for TS modules, CJS for legacy JS
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  extensionsToTreatAsEsm: ['.ts'],
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
  }
};

export default config;
