import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from '../components/HeaderComponent';

export class CartPage extends BasePage {
    readonly path = '/cart.html';
    public readonly header: HeaderComponent;
    private readonly pageTitle: Locator;
    private readonly cartItemCount: Locator;
    private readonly continueShoppingButton: Locator;
    private readonly checkoutButton: Locator;


    constructor(page: Page) {
        super(page);
        this.header = new HeaderComponent(page);
        this.pageTitle = this.page.locator('[data-test="title"]');
        this.cartItemCount = this.page.locator('[data-test="item-quantity"]');
        this.continueShoppingButton = this.page.locator('[data-test="continue-shopping"]');
        this.checkoutButton = this.page.locator('[data-test="checkout"]');
    }

    async removeItem(itemName: string): Promise<void> {
        const cartItemName = this.page.locator('[data-test="inventory-item"]').filter({ hasText: itemName});
        await cartItemName.getByRole('button', {name: 'Remove'}).click();
    }

    async continueShopping(): Promise<void> {
        await this.continueShoppingButton.click();
    }

    async goToCheckout(): Promise<void> {
        await this.checkoutButton.click();
    }

    async getCartItemQTY(): Promise<number> {
        return await this.cartItemCount.count();
    }

    async getPageTitle(): Promise<string> {
        return await this.pageTitle.innerText();
    }

    async getCartItemPrice(itemName: string): Promise<string> {
        const cartItemPrice = this.page.locator('[data-test="inventory-item"]').filter({ hasText: itemName});
        return await cartItemPrice.locator('[data-test="inventory-item-price"]').innerText();
    }
}