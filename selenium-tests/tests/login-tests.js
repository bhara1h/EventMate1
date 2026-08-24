const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Login Tests (Web)', function() {
    this.timeout(30000);
    let driver;

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    it('should successfully login with valid credentials', async function() {
        await driver.get('http://localhost:5173/login');
        
        await driver.findElement(By.id('email')).sendKeys('testuser@example.com');
        await driver.findElement(By.id('password')).sendKeys('password123');
        await driver.findElement(By.css('button[type="submit"]')).click();
        
        // Wait for redirect to dashboard
        await driver.wait(until.urlContains('/dashboard'), 5000);
        const currentUrl = await driver.getCurrentUrl();
        assert(currentUrl.includes('/dashboard'));
    });

    it('should show error message on invalid credentials', async function() {
        await driver.get('http://localhost:5173/login');
        
        await driver.findElement(By.id('email')).sendKeys('invalid@example.com');
        await driver.findElement(By.id('password')).sendKeys('wrongpassword');
        await driver.findElement(By.css('button[type="submit"]')).click();
        
        const errorElement = await driver.wait(until.elementLocated(By.className('error-message')), 5000);
        const errorMessage = await errorElement.getText();
        assert(errorMessage.includes('Invalid') || errorMessage.includes('failed'));
    });
});
