import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage.js';

export class AuthPage extends BasePage {
    constructor(driver) {
        super(driver);
        
        this.locators = {
            emailInput: By.css('input[type="email"]'),
            passwordInput: By.css('input[type="password"]'),
            submitButton: By.css('button[type="submit"]'),
            errorMessage: By.css('.text-red-500'), // Typical tailwind error class
            toggleAuthMode: By.xpath("//button[contains(text(), 'Sign Up') or contains(text(), 'Login')]")
        };
    }

    async navigateToAuth() {
        await this.navigate('/auth');
    }

    async login(email, password) {
        if (email) {
            await this.actions.typeText(this.locators.emailInput, email, 'Email Input');
        }
        if (password) {
            await this.actions.typeText(this.locators.passwordInput, password, 'Password Input');
        }
        await this.actions.click(this.locators.submitButton, 'Login Button');
    }

    async getErrorMessage() {
        return await this.actions.getText(this.locators.errorMessage, 'Error Message');
    }

    async toggleMode() {
        await this.actions.click(this.locators.toggleAuthMode, 'Toggle Login/Signup');
    }
}
