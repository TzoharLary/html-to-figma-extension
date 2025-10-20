// Jest configuration
module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.spec.js'],
  testPathIgnorePatterns: ['/node_modules/', 'popup.spec.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/node_modules/**'
  ],
  testEnvironmentOptions: {
    url: 'https://example.com'
  }
};
