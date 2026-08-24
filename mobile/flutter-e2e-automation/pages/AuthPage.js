import BasePage from './BasePage.js';

class AuthPage extends BasePage {
    get emailInput() { return this.finder.byValueKey('email_field'); }
    get passwordInput() { return this.finder.byValueKey('password_field'); }
    get loginButton() { return this.finder.byText('LOGIN'); }
    get errorMessage() { return this.finder.byValueKey('error_message'); }

    async login(email, password) {
        if (email) await this.enterText(this.emailInput, email);
        if (password) await this.enterText(this.passwordInput, password);
        await this.tap(this.loginButton);
    }

    async getErrorMessage() {
        return await this.getText(this.errorMessage);
    }
}

export default new AuthPage();
