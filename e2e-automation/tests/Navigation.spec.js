import { expect } from 'chai';
import { BasePage } from '../pages/BasePage.js';

describe('Navigation and UI Routing', function () {
    let basePage;

    beforeEach(async function () {
        basePage = new BasePage(global.driver);
    });

    it('should navigate to the root landing page successfully', async function () {
        await basePage.navigate('/');
        const title = await basePage.getPageTitle();
        expect(title).to.not.be.empty;
    });

    it('should handle browser back functionality', async function () {
        await basePage.navigate('/auth');
        await basePage.navigate('/forgot-password');
        
        await global.driver.navigate().back();
        
        const currentUrl = await global.driver.getCurrentUrl();
        expect(currentUrl).to.include('/auth');
    });
});
