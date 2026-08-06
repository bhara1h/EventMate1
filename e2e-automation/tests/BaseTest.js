import { DriverSetup } from '../utilities/DriverSetup.js';
import { logger } from '../utilities/LoggerUtil.js';
import { excelReporter } from '../utilities/ExcelReporter.js';
import { WebActions } from '../utilities/WebActions.js';
import { config } from '../config/default.js';

let driver;

export const mochaHooks = {
    beforeAll: async function () {
        logger.info('--- Starting E2E Test Execution ---');
    },
    
    beforeEach: async function () {
        logger.info(`Starting Test: ${this.currentTest.title}`);
        driver = await DriverSetup.getDriver();
        global.driver = driver; // Expose driver globally for tests to use
    },

    afterEach: async function () {
        const testName = this.currentTest.title;
        const state = this.currentTest.state;
        const duration = this.currentTest.duration;

        let screenshotPath = '';
        if (state === 'failed') {
            const webActions = new WebActions(driver);
            try {
                screenshotPath = await webActions.captureScreenshot(testName);
                const currentUrl = await driver.getCurrentUrl();
                
                excelReporter.addFailure({
                    name: testName,
                    reason: this.currentTest.err.message,
                    screenshot: screenshotPath,
                    browser: config.browser,
                    url: currentUrl
                });
                
                logger.error(`Test Failed: ${testName} - ${this.currentTest.err.message}`);
            } catch (e) {
                logger.error(`Failed to capture screenshot for ${testName}: ${e}`);
            }
        } else if (state === 'passed') {
            logger.info(`Test Passed: ${testName}`);
        }

        excelReporter.addTestResult({
            id: `TC_${Date.now()}`,
            module: this.currentTest.parent.title,
            scenario: testName,
            browser: config.browser,
            status: state,
            start: new Date(Date.now() - duration).toISOString(),
            end: new Date().toISOString(),
            duration: duration
        });

        if (driver) {
            await driver.quit();
        }
    },

    afterAll: async function () {
        await excelReporter.generateReport();
        logger.info('--- E2E Test Execution Completed ---');
    }
};
