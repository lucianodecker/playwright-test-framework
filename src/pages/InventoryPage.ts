import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from '../components/HeaderComponent';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage extends BasePage {
    readonly path = '/inventory.html';
    public readonly header: HeaderComponent;
    private readonly pageTitle: Locator;
    private readonly itemName: Locator;
    private readonly inventoryItem: Locator;
    private readonly sortDropdown: Locator;
    private readonly inventoryItemPrice: Locator;

    constructor(page: Page) {
        super(page);
        this.header = new HeaderComponent(page);
        this.pageTitle = this.page.locator('[data-test="title"]');
        this.itemName = this.page.locator('[data-test="inventory-item-name"]'); 
        this.inventoryItem = this.page.locator('[data-test="inventory-item"]'); 
        this.sortDropdown = this.page.locator('[data-test="product-sort-container"]');
        this.inventoryItemPrice = this.page.locator('[data-test="inventory-item-price"]');
    }

    async addItemToCart(itemName: string): Promise<void> {
        const inventoryItem = this.inventoryItem.filter({ hasText: itemName });
        await inventoryItem.locator('button').filter({ hasText: 'Add to cart' }).click();
    }

    async getItemNames(): Promise<string[]> {
        return await this.itemName.allTextContents();
    }

    async sortBy(option: SortOption): Promise<void> {
        await this.sortDropdown.selectOption(option);
    }

    async expectInventoryPageVisible(): Promise<void> {
        await expect(this.pageTitle).toHaveText('Products');
    }

    async getInventoryItemCount(): Promise<number> {
        return await this.inventoryItem.count();
    }

    async getRawItemPrices(): Promise<string[]> {
        return await this.inventoryItemPrice.allTextContents();
    }

    async removeItemFromCart(itemName: string): Promise<void> {
        const inventoryCartItem = this.inventoryItem.filter({ hasText: itemName });
        await inventoryCartItem.locator('button').filter({ hasText: 'Remove' }).click();
    } 
}