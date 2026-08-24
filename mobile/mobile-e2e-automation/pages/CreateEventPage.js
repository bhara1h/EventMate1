import BasePage from './BasePage.js';

class CreateEventPage extends BasePage {
    get titleInput() { return '~Event Title Input'; }
    get descriptionInput() { return '~Event Description Input'; }
    get dateInput() { return '~Event Date Input'; }
    get submitBtn() { return '~Submit Event Button'; }
    get validationError() { return '~Form Validation Error'; }

    async fillEventDetails(title, description, date) {
        if (title) await this.typeText(this.titleInput, title);
        if (description) await this.typeText(this.descriptionInput, description);
        if (date) await this.typeText(this.dateInput, date);
    }

    async submit() {
        await this.tap(this.submitBtn);
    }
}

export default new CreateEventPage();
