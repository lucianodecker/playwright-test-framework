import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

type CustomFixtures = {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    authenticatedPage: InventoryPage;
};

export const test = base.extend<CustomFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await use(loginPage);
    },
    inventoryPage: async ({ page }, use) => {
        const inventoryPage = new InventoryPage(page);
        await use(inventoryPage);
    },
    authenticatedPage: async ({ loginPage, inventoryPage }, use) => {
        const username = process.env.STANDARD_USER;
        const password = process.env.STANDARD_PASSWORD;
        if (!username || !password) {
            throw new Error(`Missing environment variables: STANDARD_USER or STANDARD_PASSWORD are not defined in the .env file. ` +
            `Please ensure your local environment is correctly configured.`);
        }
        await loginPage.loginWith(username, password);   
        await use(inventoryPage);
    },
});



export { expect } from '@playwright/test';