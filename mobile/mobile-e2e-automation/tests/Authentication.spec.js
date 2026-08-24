import AuthPage from '../pages/AuthPage.js';
import { expect } from 'chai';

describe('Authentication Appium Tests', () => {
    
    it('should throw validation error on empty credentials', async () => {
        await AuthPage.login('', '');
        
        // Assume an accessibility id or message pops up
        const isErrorDisplayed = await AuthPage.isElementDisplayed(AuthPage.errorMessage);
        expect(isErrorDisplayed).to.be.true;
    });

    it('should throw error on invalid credentials', async () => {
        await AuthPage.login('invalid@example.com', 'wrongpassword');
        const errorText = await AuthPage.getError();
        expect(errorText).to.include('Invalid credentials');
    });

    it('should successfully toggle to registration view', async () => {
        await AuthPage.toggleAuthMode();
        // Check if a specific element on the register screen appears
        // Assuming ~Register Button is present
        const isRegisterVisible = await AuthPage.isElementDisplayed('~Register Button');
        expect(isRegisterVisible).to.be.true;
    });
});
