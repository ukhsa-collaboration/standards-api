// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  transform: {}, // ← from JS config
  coverageThreshold: { // ← from JS config
    global: {
      branches: 90,
      functions: 100,
      lines: 90,
      statements: 90,
    }
  },
};

export default config;
