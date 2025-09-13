/** @type {import('jest').Config} */
module.exports = {
  rootDir: __dirname,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup-tests.web.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': ['babel-jest', {
      presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
    }],
  },
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '\\.(css|less|scss)$': '<rootDir>/tests/__mocks__/style-mock.js',
  },
  testMatch: ['<rootDir>/**/*.web.test.(ts|tsx)'],
};
