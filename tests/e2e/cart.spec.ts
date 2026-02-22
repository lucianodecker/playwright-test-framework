import { test, expect } from '../../src/fixtures/fixtures';
import { CartPage } from '../../src/pages/CartPage';

test.describe('Cart', () => {
    test('should display cart page', async ({ authenticatedPage, page }) => {
        const cartPage = new CartPage(page);
        await cartPage.header.goToCart();
        expect (await authenticatedPage.getPageTitle()).toBe('Your Cart');
    });

    test('continue shopping should navigate back to inventory', async ({ authenticatedPage, page }) => {
        const cartPage = new CartPage(page);
        await authenticatedPage.header.goToCart();
        await cartPage.continueShopping();
        expect (await authenticatedPage.getPageTitle()).toBe('Products');
    });

    test('checkout button should navigate to checkout-step-one page', async ({ authenticatedPage, page }) => {
        const cartPage = new CartPage(page);
        await authenticatedPage.header.goToCart();
        await cartPage.goToCheckout();
        expect (await authenticatedPage.getPageTitle()).toBe('Checkout: Your Information');
    });

    test('should remove a product from cart', async ({ authenticatedPage, page }) => {
        const cartPage = new CartPage(page);
        await authenticatedPage.addItemToCart('Sauce Labs Bolt T-Shirt');
        await cartPage.removeItem('Sauce Labs Bolt T-Shirt');
        const cartQuantity = await cartPage.getCartItemQTY();
        expect (cartQuantity).toBe(0);
    });

    test('should display correct product and price in cart', async ({ authenticatedPage, page }) => {
        const cartPage = new CartPage(page);
        await authenticatedPage.addItemToCart('Sauce Labs Bolt T-Shirt');
        await cartPage.header.goToCart();
        expect (await cartPage.getCartItemPrice('Sauce Labs Bolt T-Shirt')).toBe('$15.99');
    });

    test('should have multiple product in cart', async ({ authenticatedPage, page }) => {
        const cartPage = new CartPage(page);
        await authenticatedPage.addItemToCart('Sauce Labs Bolt T-Shirt');
        await authenticatedPage.addItemToCart('Sauce Labs Fleece Jacket');
        await authenticatedPage.addItemToCart('Sauce Labs Backpack');
        await cartPage.header.goToCart();
        const cartQuantity = await cartPage.getCartItemQTY();
        expect (cartQuantity).toBe(3);
    });
})