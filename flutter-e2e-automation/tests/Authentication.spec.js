import AuthPage from '../pages/AuthPage.js';
import { expect } from 'chai';

describe('Flutter Authentication Appium Tests', () => {
    
    it('should throw validation error on empty credentials', async () => {
        await AuthPage.login('', '');
        const errorText = await AuthPage.getErrorMessage();
        expect(errorText).to.not.be.empty;
    });

    it('should throw error on invalid credentials', async () => {
        await AuthPage.login('invalid@example.com', 'wrongpassword');
        const errorText = await AuthPage.getErrorMessage();
        expect(errorText).to.include('Invalid credentials');
    });

    it('should successfully login with valid credentials', async () => {
        await AuthPage.login('test@example.com', 'password123');
        // Check if dashboard is loaded by expecting a finder
        // flutter:waitFor automatically asserts presence
        const dashboardTitle = AuthPage.finder.byText('Dashboard');
        await driver.execute('flutter:waitFor', dashboardTitle);
    });
});
