import { logger } from './Logger.js';

export class WaitActions {
    static async waitForDisplayed(element, timeout = 10000) {
        logger.info(`Waiting for element to be displayed within ${timeout}ms`);
        await element.waitForDisplayed({ timeout });
    }

    static async waitForClickable(element, timeout = 10000) {
        logger.info(`Waiting for element to be clickable within ${timeout}ms`);
        await element.waitForClickable({ timeout });
    }
}
