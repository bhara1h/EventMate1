import BasePage from './BasePage.js';

class AuthPage extends BasePage {
    get emailInput() { return '~Email Input'; } // Using accessibility ids
    get passwordInput() { return '~Password Input'; }
    get loginButton() { return '~Login Button'; }
    get toggleRegisterBtn() { return '~Toggle Register Mode'; }
    get errorMessage() { return '~Error Message'; }

    async login(email, password) {
        if (email) await this.typeText(this.emailInput, email);
        if (password) await this.typeText(this.passwordInput, password);
        await this.tap(this.loginButton);
    }

    async getError() {
        return await this.getText(this.errorMessage);
    }

    async toggleAuthMode() {
        await this.tap(this.toggleRegisterBtn);
    }
}

export default new AuthPage();
