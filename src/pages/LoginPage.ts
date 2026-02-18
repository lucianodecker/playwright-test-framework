import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    readonly path = '/';
    private readonly username: Locator;
    private readonly password: Locator;
    private readonly button: Locator;
    private readonly error: Locator;

    constructor(page: Page) {
        super(page);
        this.username = this.page.locator('[data-test="username"]');
        this.password = this.page.locator('[data-test="password"]');
        this.button = this.page.locator('[data-test="login-button"]');
        this.error = this.page.locator('[data-test="error"]');
    }

    async loginWith(username: string, password: string): Promise<void> {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.submitLogin();
    }

    async expectErrorMessage(expectedText: string): Promise<void> {
        await expect(this.error).toHaveText(expectedText);
    }

    async submitLogin(): Promise<void> {
        await this.button.click();
    }
}