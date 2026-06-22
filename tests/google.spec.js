// @ts-check
import { test, expect } from '@playwright/test';

test('search for amazon on google', async ({ page }) => {
  await page.goto('https://www.google.com/');

  // Accept cookie banner if it appears.
  const acceptButton = page.locator('button', { hasText: /I agree|Accept all|Agree/i });
  if (await acceptButton.count()) {
    await acceptButton.first().click();
  }

  await page.getByRole('textbox', { name: /search/i }).fill('amazon');
  await page.keyboard.press('Enter');

  await expect(page.locator('text=amazon.com')).toBeVisible({ timeout: 10000 });
});
