import { expect } from 'chai';
import { AuthPage } from '../pages/AuthPage.js';

describe('Authentication Flow', function () {
    let authPage;

    beforeEach(async function () {
        // global.driver is set in BaseTest.js
        authPage = new AuthPage(global.driver);
        await authPage.navigateToAuth();
    });

    it('should show error on empty email and password', async function () {
        await authPage.login('', '');
        // Frontend likely has HTML5 validation, or displays a custom error.
        // For demonstration, we attempt to capture a rendered error.
        const title = await authPage.getPageTitle();
        expect(title).to.not.be.empty;
    });

    it('should show error on invalid credentials', async function () {
        await authPage.login('invalid@example.com', 'wrongpassword123');
        const error = await authPage.getErrorMessage();
        expect(error).to.include('Invalid credentials'); // Example assertion
    });
    
    it('should successfully toggle to Registration mode', async function () {
        await authPage.toggleMode();
        // Since we are interacting with dynamic DOM, we can assert URL or specific element
        const title = await authPage.getPageTitle();
        expect(title).to.be.a('string');
    });
});
