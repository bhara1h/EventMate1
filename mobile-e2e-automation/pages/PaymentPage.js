import BasePage from './BasePage.js';

class PaymentPage extends BasePage {
    get payButton() { return '~Pay Now Button'; }
    get amountText() { return '~Payment Amount Text'; }
    get successMessage() { return '~Success Message'; }

    async initiatePayment() {
        await this.tap(this.payButton);
    }

    async getSuccessConfirmation() {
        return await this.getText(this.successMessage);
    }
}

export default new PaymentPage();
