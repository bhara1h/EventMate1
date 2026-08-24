import { WebActions } from '../utilities/WebActions.js';
import { config } from '../config/default.js';

export class BasePage {
    constructor(driver) {
        this.driver = driver;
        this.actions = new WebActions(driver);
        this.baseUrl = config.baseUrl;
    }

    async navigate(path = '') {
        await this.actions.navigateTo(`${this.baseUrl}${path}`);
    }

    async getPageTitle() {
        return await this.driver.getTitle();
    }
}
