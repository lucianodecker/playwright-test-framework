import { test, expect } from '../../src/fixtures/fixtures';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutCompletePage } from '../../src/pages/CheckoutCompletePage';
import { CheckoutStepOnePage } from '../../src/pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../../src/pages/CheckoutStepTwoPage';

test.describe('Checkout', () => {
    test('should display checkout-step-one page', async ({ authenticatedPage, page }) => {
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutStepOnePage(page);
        await authenticatedPage.header.goToCart();
        await cartPage.goToCheckout();
        expect (await checkoutPage.getPageTitle()).toBe('Checkout: Your Information');
    });

    test('should fill out input fields on checkout-step-one page', async ({ authenticatedPage, page }) => {
        const cartPage = new CartPage(page);
        const checkoutPageOne = new CheckoutStepOnePage(page);
        const checkoutPageTwo = new CheckoutStepTwoPage(page);
        await authenticatedPage.header.goToCart();
        await cartPage.goToCheckout();
        await checkoutPageOne.fillCheckoutForm('Max', 'Mustermann', '08151');
        await checkoutPageOne.continueCheckout();
        expect (await checkoutPageTwo.getPageTitle()).toBe('Checkout: Overview');
    });

    test('should display error msg with empty inputs on checkout-step-one page', async ({ authenticatedPage, page }) => {
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutStepOnePage(page);
        await authenticatedPage.header.goToCart();
        await cartPage.goToCheckout();
        await checkoutPage.continueCheckout();
        expect (await checkoutPage.getErrorMessage()).toBe('Error: First Name is required');
    });

    test('should display correct product and price on checkout-step-two page', async ({ authenticatedPage, page }) => {
        const cartPage = new CartPage(page);
        const checkoutPageOne = new CheckoutStepOnePage(page);
        const checkoutPageTwo = new CheckoutStepTwoPage(page);
        await authenticatedPage.addItemToCart('Sauce Labs Bolt T-Shirt');
        await authenticatedPage.addItemToCart('Sauce Labs Fleece Jacket');
        await authenticatedPage.addItemToCart('Sauce Labs Backpack');
        await authenticatedPage.header.goToCart();
        await cartPage.goToCheckout();
        await checkoutPageOne.fillCheckoutForm('Max', 'Mustermann', '08151');
        await checkoutPageOne.continueCheckout();
        expect (await checkoutPageTwo.getCartItemNames()).toEqual(['Sauce Labs Bolt T-Shirt', 'Sauce Labs Fleece Jacket', 'Sauce Labs Backpack']);
        expect (await checkoutPageTwo.getSubTotal()).toBe('Item total: $95.97');
        expect (await checkoutPageTwo.getTax()).toBe('Tax: $7.68');
        expect (await checkoutPageTwo.getPriceTotal()).toBe('Total: $103.65');
    });

    test('complete buy process', async ({ authenticatedPage, page }) => {
        const cartPage = new CartPage(page);
        const checkoutPageOne = new CheckoutStepOnePage(page);
        const checkoutPageTwo = new CheckoutStepTwoPage(page);
        const checkoutComplete = new CheckoutCompletePage(page);
        await authenticatedPage.addItemToCart('Sauce Labs Bolt T-Shirt');
        await authenticatedPage.addItemToCart('Sauce Labs Fleece Jacket');
        await authenticatedPage.addItemToCart('Sauce Labs Backpack');
        await authenticatedPage.header.goToCart();
        await cartPage.goToCheckout();
        await checkoutPageOne.fillCheckoutForm('Max', 'Mustermann', '08151');
        await checkoutPageOne.continueCheckout();
        await checkoutPageTwo.finishCheckout();
        expect (await checkoutComplete.getPageTitle()).toBe('Checkout: Complete!');
        expect (await checkoutComplete.getCompleteHeader()).toBe('Thank you for your order!');
        await checkoutComplete.endCheckoutProcess();
        expect (await authenticatedPage.getPageTitle()).toBe('Products');
    });

    test('cancel checkout on page one', async ({ authenticatedPage, page }) => {
        const cartPage = new CartPage(page);
        const checkoutPageOne = new CheckoutStepOnePage(page);
        await authenticatedPage.header.goToCart();
        await cartPage.goToCheckout();
        await checkoutPageOne.cancelCheckout();
        expect (await cartPage.getPageTitle()).toBe('Your Cart');
    });

    test('cancel checkout on page two', async ({ authenticatedPage, page }) => {
        const cartPage = new CartPage(page);
        const checkoutPageOne = new CheckoutStepOnePage(page);
        const checkoutPageTwo = new CheckoutStepTwoPage(page);
        await authenticatedPage.header.goToCart();
        await cartPage.goToCheckout();
        await checkoutPageOne.fillCheckoutForm('Max', 'Mustermann', '08151');
        await checkoutPageOne.continueCheckout();
        await checkoutPageTwo.cancelCheckout();
        expect (await authenticatedPage.getPageTitle()).toBe('Products');
    });
})