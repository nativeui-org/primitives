const rnPreset = require('react-native/jest-preset');

/** @type {import('jest').Config} */
module.exports = {
  ...rnPreset,
  rootDir: __dirname,
  transform: {
    ...rnPreset.transform,
    '^.+\\.(ts|tsx)$': ['babel-jest', {
      presets: ['@react-native/babel-preset', '@babel/preset-typescript'],
    }],
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup-tests.native.ts'],
  testMatch: ['<rootDir>/**/*.native.test.(ts|tsx)'],
  moduleNameMapper: {
    ...rnPreset.moduleNameMapper,
  },
};
