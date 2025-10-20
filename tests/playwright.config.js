// Playwright configuration for Chrome extension testing
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: '**/popup.spec.js',
  testIgnore: ['**/*.spec.js', '!**/popup.spec.js'],
  use: {
    headless: false,
    channel: 'chromium',
  },
});
