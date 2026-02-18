import { test, expect } from '../../src/fixtures/fixtures';

test.describe('Login', () => {
    test('should login with valid credentials', async ({ loginPage, page }) => {
        await loginPage.loginWith('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/inventory\.html/);
    });
    test('should not login with invalid credentials', async ({ loginPage }) => {
        await loginPage.loginWith('locked_out_user', 'secret_sauce');
        await loginPage.expectErrorMessage('Epic sadface: Sorry, this user has been locked out.');
    });
    test('empty login credentials', async ({ loginPage }) => {
        await loginPage.submitLogin();
        await loginPage.expectErrorMessage('Epic sadface: Username is required');
    });
    test('wrong user password', async ({ loginPage }) => {
        await loginPage.loginWith('standard_user', 'public_sauce');
        await loginPage.expectErrorMessage('Epic sadface: Username and password do not match any user in this service');
    });
});