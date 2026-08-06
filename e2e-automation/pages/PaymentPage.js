import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage.js';

export class PaymentPage extends BasePage {
    constructor(driver) {
        super(driver);

        this.locators = {
            payButton: By.xpath("//button[contains(text(), 'Pay')]"),
            amountDisplay: By.css('.payment-amount'), // Assuming there's a display
            successMessage: By.css('.text-green-500, .success-toast')
        };
    }

    async navigateToPayment(eventId) {
        await this.navigate(`/payment/${eventId}`);
    }

    async submitPayment() {
        await this.actions.click(this.locators.payButton, 'Pay Button');
    }

    async getSuccessMessage() {
        return await this.actions.getText(this.locators.successMessage, 'Success Message');
    }
}
