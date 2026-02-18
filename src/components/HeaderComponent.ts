import { type Locator, type Page } from '@playwright/test';

export class HeaderComponent {
    private readonly page: Page;
    private readonly cartBadge: Locator;
    private readonly cartButton: Locator;
    private readonly openMenu: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartBadge = this.page.locator('[data-test="shopping-cart-badge"]');
        this.cartButton = this.page.locator('[data-test="shopping-cart-link"]');
        this.openMenu = this.page.locator('[data-test="open-menu"]');
    }

    async getCartBadgeCount(): Promise<number> {
        if (await this.cartBadge.count() === 0) return 0;
        const text = await this.cartBadge.first().innerText();
        const parsed = parseInt(text.trim(), 10);
        return Number.isNaN(parsed) ? 0 : parsed;
    }

    async goToCart(): Promise<void> {
        await this.cartButton.click()
    }

    async openBurgerMenu(): Promise<void> {
        await this.openMenu.click();
    }
}