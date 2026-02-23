import { test as setup } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({ page }) => {
    const username = process.env.STANDARD_USER;
    const password = process.env.STANDARD_PASSWORD;
        if (!username || !password) {
            throw new Error(`Missing environment variables: STANDARD_USER or STANDARD_PASSWORD are not defined in the .env file. ` +
            `Please ensure your local environment is correctly configured.`);
        }
    await page.goto('/');
    await page.locator('[data-test="username"]').fill(username);
    await page.locator('[data-test="password"]').fill(password);
    await page.locator('[data-test="login-button"]').click();
    await page.waitForURL(/inventory/);
    await page.context().storageState({ path: authFile });
});