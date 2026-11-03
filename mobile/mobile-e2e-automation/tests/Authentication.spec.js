import AuthPage from '../pages/AuthPage.js';
import { expect } from 'chai';

describe('Authentication Appium Tests', () => {
    it('should show a validation error when credentials are empty', async () => {
        await AuthPage.login('', '');

        const errorText = await AuthPage.getError('Please fill in all fields');
        expect(errorText).to.equal('Please fill in all fields');
        await AuthPage.dismissAlert();
    });

    it('should show the backend error for invalid credentials', async () => {
        await AuthPage.login('invalid@example.com', 'wrongpassword');

        const errorText = await AuthPage.getError('Invalid email or password');
        expect(errorText).to.equal('Invalid email or password');
        await AuthPage.dismissAlert();
    });

    it('should navigate to the registration screen', async () => {
        await AuthPage.toggleAuthMode();

        const isRegisterVisible = await AuthPage.isElementDisplayed('~register-screen-title');
        expect(isRegisterVisible).to.be.true;
    });
});
