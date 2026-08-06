import { until, By } from 'selenium-webdriver';
import { logger } from './LoggerUtil.js';
import { config } from '../config/default.js';
import fs from 'fs';
import path from 'path';

export class WebActions {
    constructor(driver) {
        this.driver = driver;
    }

    async navigateTo(url) {
        logger.info(`Navigating to URL: ${url}`);
        await this.driver.get(url);
    }

    async click(locator, locatorName = 'Element') {
        try {
            logger.info(`Waiting for ${locatorName} to be clickable`);
            const element = await this.driver.wait(until.elementLocated(locator), config.timeouts.explicit);
            await this.driver.wait(until.elementIsVisible(element), config.timeouts.explicit);
            await this.driver.wait(until.elementIsEnabled(element), config.timeouts.explicit);
            await element.click();
            logger.info(`Clicked on ${locatorName}`);
        } catch (error) {
            logger.error(`Error clicking on ${locatorName}: ${error.message}`);
            throw error;
        }
    }

    async typeText(locator, text, locatorName = 'Element') {
        try {
            logger.info(`Entering text into ${locatorName}`);
            const element = await this.driver.wait(until.elementLocated(locator), config.timeouts.explicit);
            await this.driver.wait(until.elementIsVisible(element), config.timeouts.explicit);
            await element.clear();
            await element.sendKeys(text);
        } catch (error) {
            logger.error(`Error typing text in ${locatorName}: ${error.message}`);
            throw error;
        }
    }

    async getText(locator, locatorName = 'Element') {
        try {
            const element = await this.driver.wait(until.elementLocated(locator), config.timeouts.explicit);
            await this.driver.wait(until.elementIsVisible(element), config.timeouts.explicit);
            return await element.getText();
        } catch (error) {
            logger.error(`Error getting text from ${locatorName}: ${error.message}`);
            throw error;
        }
    }

    async captureScreenshot(testName) {
        const screenshotDir = config.paths.screenshots;
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${testName.replace(/\s+/g, '_')}_${timestamp}.png`;
        const filePath = path.join(screenshotDir, filename);

        const image = await this.driver.takeScreenshot();
        fs.writeFileSync(filePath, image, 'base64');
        logger.info(`Screenshot captured: ${filePath}`);
        return filePath;
    }

    async scrollToElement(locator) {
        const element = await this.driver.findElement(locator);
        await this.driver.executeScript("arguments[0].scrollIntoView(true);", element);
    }
}
