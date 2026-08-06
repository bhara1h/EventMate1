import { Gestures } from '../utilities/Gestures.js';
import { WaitActions } from '../utilities/WaitActions.js';
import { logger } from '../utilities/Logger.js';

export default class BasePage {
    async tap(elementLocator) {
        const el = await $(elementLocator);
        await WaitActions.waitForClickable(el);
        await Gestures.tap(el);
        logger.info(`Tapped on element: ${elementLocator}`);
    }

    async typeText(elementLocator, text) {
        const el = await $(elementLocator);
        await WaitActions.waitForDisplayed(el);
        await el.setValue(text);
        logger.info(`Typed text '${text}' in element: ${elementLocator}`);
    }

    async getText(elementLocator) {
        const el = await $(elementLocator);
        await WaitActions.waitForDisplayed(el);
        const text = await el.getText();
        logger.info(`Got text '${text}' from element: ${elementLocator}`);
        return text;
    }

    async isElementDisplayed(elementLocator) {
        try {
            const el = await $(elementLocator);
            return await el.isDisplayed();
        } catch (error) {
            return false;
        }
    }
}
