import { PricingService } from '../../src/services/pricing.service';
import { test, expect } from '../../src/fixtures/fixtures';

test.describe('Inventory', () => {
    test('should display products after login', async ({ authenticatedPage }) => {
        await authenticatedPage.expectInventoryPageVisible();
    });
    test('should display 6 products', async ({ authenticatedPage }) => {
        expect(await authenticatedPage.getInventoryItemCount()).toBe(6);
    });
    test('should sort products by price low to high', async ({ authenticatedPage }) => {
        await authenticatedPage.sortBy('lohi');
        const rawPrices = await authenticatedPage.getRawItemPrices();
        const prices = PricingService.parsePrices(rawPrices);
        expect(PricingService.isSortedAscending(prices)).toBe(true);
    });
    test('should add a product to cart', async ({ authenticatedPage }) => {
        await authenticatedPage.addItemToCart('Sauce Labs Fleece Jacket');
        const cartQuantity = await authenticatedPage.header.getCartBadgeCount();
        expect(cartQuantity).toBe(1); 
    });
    test('should remove a product from cart', async ({ authenticatedPage }) => {
        await authenticatedPage.addItemToCart('Sauce Labs Fleece Jacket');
        await authenticatedPage.removeItemFromCart('Sauce Labs Fleece Jacket');
        const cartQuantity = await authenticatedPage.header.getCartBadgeCount();
        expect(cartQuantity).toBe(0); 
    });
})