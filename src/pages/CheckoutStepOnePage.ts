import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from '../components/HeaderComponent';

export class CheckoutStepOnePage extends BasePage {
    readonly path = '/checkout-step-one.html'
    public readonly header: HeaderComponent;
    private readonly pageTitle: Locator;
    private readonly inputFirstName: Locator;
    private readonly inputLastName: Locator;
    private readonly inputPostalCode: Locator;    
    private readonly cancelButton: Locator;
    private readonly continueButton: Locator;
    private readonly error: Locator;    

    constructor(page: Page) {
        super(page);
        this.header = new HeaderComponent(page);
        this.pageTitle = this.page.locator('[data-test="title"]');
        this.inputFirstName = this.page.locator('[data-test="firstName"]');
        this.inputLastName = this.page.locator('[data-test="lastName"]');
        this.inputPostalCode = this.page.locator('[data-test="postalCode"]');
        this.cancelButton = this.page.locator('[data-test="cancel"]');
        this.continueButton = this.page.locator('[data-test="continue"]');
        this.error = this.page.locator('[data-test="error"]');
    }

    async fillCheckoutForm(firstName: string, lastName: string, postalCode: string): Promise<void> {
        await this.inputFirstName.fill(firstName);
        await this.inputLastName.fill(lastName);
        await this.inputPostalCode.fill(postalCode);
    }

    async continueCheckout(): Promise<void> {
        await  this.continueButton.click();
    }

    async cancelCheckout(): Promise<void> {
        await  this.cancelButton.click();
    }

    async getPageTitle(): Promise<string> {
        return await this.pageTitle.innerText();
    }

    async getErrorMessage(): Promise<string> {
        return await this.error.innerText()
    }
}
