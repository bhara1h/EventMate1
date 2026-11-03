import BasePage from './BasePage.js';

class AuthPage extends BasePage {
    get emailInput() { return '~login-email-input'; }
    get passwordInput() { return '~login-password-input'; }
    get loginButton() { return '~login-submit-button'; }
    get toggleRegisterBtn() { return '~login-register-link'; }

    async login(email, password) {
        if (email) await this.typeText(this.emailInput, email);
        if (password) await this.typeText(this.passwordInput, password);
        await this.tap(this.loginButton);
    }

    async getError(message) {
        const alertMessage = `android=new UiSelector().text("${message}")`;
        return await this.getText(alertMessage);
    }

    async toggleAuthMode() {
        await this.tap(this.toggleRegisterBtn);
    }

    async dismissAlert() {
        await this.tap('android=new UiSelector().text("OK")');
    }
}

export default new AuthPage();
