import CreateEventPage from '../pages/CreateEventPage.js';
import { expect } from 'chai';

describe('Form Validation Appium Tests - Organizer', () => {
    
    it('should validate required fields when creating an event', async () => {
        // Leave all empty and submit
        await CreateEventPage.submit();
        
        const isErrorVisible = await CreateEventPage.isElementDisplayed(CreateEventPage.validationError);
        expect(isErrorVisible).to.be.true;
    });

    it('should validate valid data entry', async () => {
        await CreateEventPage.fillEventDetails('Appium Conf 2026', 'Mobile E2E Testing', '2026-12-01');
        await CreateEventPage.submit();
        
        // Assert some success view or list
        const isSuccess = await CreateEventPage.isElementDisplayed('~Event Created Success');
        expect(isSuccess).to.be.true;
    });
});
