// Playwright test: popup interaction
const { test, expect } = require('@playwright/test');
const path = require('path');

test('Popup HTML file exists and button is present', async ({ page }) => {
  const popupPath = 'file://' + path.resolve(__dirname, '../src/popup/popup.html');
  await page.goto(popupPath);
  
  const button = await page.locator('#convertBtn');
  await expect(button).toBeVisible();
  
  const heading = await page.locator('h1');
  await expect(heading).toHaveText('html-to-figma');
});
