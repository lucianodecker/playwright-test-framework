import { test, expect } from '../../src/fixtures/fixtures';

test.describe('Visual Regression', () => {
    test('login page should match baseline', async ({ loginPage, page }) => {
        await expect(page).toHaveScreenshot('login-page.png', { maxDiffPixelRatio: 0.05 });
    });

    test('inventory page should match baseline', async ({ authenticatedPage, page }) => {
    await expect(page).toHaveScreenshot('inventory-page.png', { maxDiffPixelRatio: 0.1 });
});

    test('cart page should match baseline', async ({ authenticatedPage, page }) => {
        await authenticatedPage.header.goToCart();
        await expect(page).toHaveScreenshot('cart-page.png', { maxDiffPixelRatio: 0.05 });
    });
});