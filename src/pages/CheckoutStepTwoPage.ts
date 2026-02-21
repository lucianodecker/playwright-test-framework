import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from '../components/HeaderComponent';

export class CheckoutStepTwoPage extends BasePage {
    readonly path = '/checkout-step-two.html'
    public readonly header: HeaderComponent;
    private readonly pageTitle: Locator;
    private readonly cartItemCount: Locator;
    private readonly cartItemNames: Locator;
    private readonly paymentInfo: Locator;
    private readonly shippingInfo: Locator;
    private readonly itemSubTotal: Locator;
    private readonly tax: Locator;
    private readonly priceTotal: Locator;
    private readonly cancelButton: Locator;
    private readonly finishButton: Locator;

    constructor(page: Page) {
        super(page);
        this.header = new HeaderComponent(page);
        this.pageTitle = this.page.locator('[data-test="title"]');
        this.cartItemCount = this.page.locator('[data-test="item-quantity"]');
        this.cartItemNames = this.page.locator('[data-test="inventory-item-name"]');
        this.paymentInfo = this.page.locator('[data-test="payment-info-value"]');
        this.shippingInfo = this.page.locator('[data-test="shipping-info-value"]');
        this.itemSubTotal = this.page.locator('[data-test="subtotal-label"]');
        this.tax = this.page.locator('[data-test="tax-label"]');
        this.priceTotal = this.page.locator('[data-test="total-label"]');
        this.cancelButton = this.page.locator('[data-test="cancel"]');
        this.finishButton = this.page.locator('[data-test="finish"]');
    }

    async finishCheckout(): Promise<void> {
        await this.finishButton.click();
    }

    async cancelCheckout(): Promise<void> {
        await this.cancelButton.click();
    }

    async getCartItemQTY(): Promise<number> {
        return await this.cartItemCount.count();
    }

    async getCartItemNames(): Promise<string[]> {
        return await this.cartItemNames.allTextContents();
    }

    async getPageTitle(): Promise<string> {
        return await this.pageTitle.innerText();
    }

    async getPaymentInfo(): Promise<string> {
        return await this.paymentInfo.innerText();
    }

    async getShippingInfo(): Promise<string> {
        return await this.shippingInfo.innerText();
    }

    async getSubTotal(): Promise<string> {
        return await this.itemSubTotal.innerText();
    }

    async getTax(): Promise<string> {
        return await this.tax.innerText();
    }

    async getPriceTotal(): Promise<string> {
        return await this.priceTotal.innerText();
    }
}