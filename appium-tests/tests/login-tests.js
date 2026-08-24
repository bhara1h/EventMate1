const wdio = require('webdriverio');
const assert = require('assert');

const opts = {
  path: '/wd/hub',
  port: 4723,
  capabilities: {
    platformName: "Android",
    platformVersion: "11.0",
    deviceName: "Android Emulator",
    app: "/path/to/app.apk",
    automationName: "UiAutomator2"
  }
};

describe('Login Tests (Mobile)', function () {
    this.timeout(50000);
    let client;

    before(async function () {
        client = await wdio.remote(opts);
    });

    after(async function () {
        if (client) {
            await client.deleteSession();
        }
    });

    it('should login successfully with valid credentials', async function () {
        const emailField = await client.$('~email-input');
        await emailField.setValue('testuser@example.com');

        const passwordField = await client.$('~password-input');
        await passwordField.setValue('password123');

        const loginButton = await client.$('~login-button');
        await loginButton.click();

        // Wait for dashboard to appear
        const dashboard = await client.$('~dashboard-screen');
        await dashboard.waitForDisplayed({ timeout: 5000 });
        assert(await dashboard.isDisplayed());
    });

    it('should show error on invalid credentials', async function () {
        const emailField = await client.$('~email-input');
        await emailField.setValue('invalid@example.com');

        const passwordField = await client.$('~password-input');
        await passwordField.setValue('wrongpassword');

        const loginButton = await client.$('~login-button');
        await loginButton.click();

        const errorMessage = await client.$('~error-message');
        await errorMessage.waitForDisplayed({ timeout: 5000 });
        const text = await errorMessage.getText();
        assert(text.includes('Invalid'));
    });
});
