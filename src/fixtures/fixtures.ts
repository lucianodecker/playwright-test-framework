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
    authenticatedPage: async ({ page }, use) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.goto();
        await inventoryPage.waitForItems();
        await use(inventoryPage);
    },
});



export { expect } from '@playwright/test';