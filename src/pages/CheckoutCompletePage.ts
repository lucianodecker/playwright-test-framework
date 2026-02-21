import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from '../components/HeaderComponent';

export class CheckoutCompletePage extends BasePage {
    readonly path = '/checkout-complete.html'
    public readonly header: HeaderComponent;
    private readonly pageTitle: Locator;
    private readonly completeHeader: Locator;
    private readonly backHomeButton: Locator;

    constructor(page: Page) {
        super(page);
        this.header = new HeaderComponent(page);
        this.pageTitle = this.page.locator('[data-test="title"]');
        this.completeHeader = this.page.locator('[data-test="complete-header"]');
        this.backHomeButton = this.page.locator('[data-test="back-to-products"]');
    }

    async endCheckoutProcess(): Promise<void> {
        await this.backHomeButton.click();
    }

    async getPageTitle(): Promise<string> {
        return await this.pageTitle.innerText();
    }

    async getCompleteHeader(): Promise<string> {
        return await this.completeHeader.innerText();
    }
}