import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage.js';

export class OrganizerDashboardPage extends BasePage {
    constructor(driver) {
        super(driver);

        this.locators = {
            createEventBtn: By.xpath("//button[contains(text(), 'Create Event')]"),
            eventTitleInput: By.css('input[name="title"]'),
            eventDescInput: By.css('textarea[name="description"]'),
            eventDateInput: By.css('input[type="date"]'),
            submitEventBtn: By.css('form button[type="submit"]'),
            certificateForm: By.css('form'),
            validationError: By.css('.error-message, .text-red-500')
        };
    }

    async navigateToDashboard() {
        await this.navigate('/organizer/dashboard');
    }

    async createEvent(title, description, date) {
        await this.actions.click(this.locators.createEventBtn, 'Create Event Button');
        if (title) await this.actions.typeText(this.locators.eventTitleInput, title, 'Event Title');
        if (description) await this.actions.typeText(this.locators.eventDescInput, description, 'Event Description');
        if (date) await this.actions.typeText(this.locators.eventDateInput, date, 'Event Date');
        await this.actions.click(this.locators.submitEventBtn, 'Submit Event');
    }

    async getValidationError() {
        return await this.actions.getText(this.locators.validationError, 'Validation Error');
    }
}
