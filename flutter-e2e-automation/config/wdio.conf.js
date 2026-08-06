import dotenv from 'dotenv';
import { ExcelReporter } from '../utilities/ExcelReporter.js';
dotenv.config();

export const config = {
    runner: 'local',
    port: 4723,
    specs: [
        '../tests/**/*.spec.js'
    ],
    maxInstances: process.env.PARALLEL ? 3 : 1,
    capabilities: [{
        platformName: 'Android',
        'appium:automationName': 'Flutter',
        'appium:deviceName': process.env.DEVICE_NAME || 'Android Emulator',
        'appium:app': process.env.APK_PATH || undefined,
        'appium:appPackage': process.env.APP_PACKAGE || 'com.company.app',
        'appium:appActivity': process.env.APP_ACTIVITY || 'com.company.app.MainActivity',
        'appium:autoGrantPermissions': true,
        'appium:newCommandTimeout': 240,
    }],
    logLevel: 'info',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['appium'],
    framework: 'mocha',
    reporters: [
        'spec',
        ['mochawesome', {
            outputDir: './reports/html',
            outputFileFormat: function(opts) { 
                return `Flutter_E2E_Report.json`
            }
        }]
    ],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },

    onPrepare: function (config, capabilities) {
        global.excelReporter = new ExcelReporter();
    },

    afterTest: async function(test, context, { error, result, duration, passed, retries }) {
        if (!passed) {
            // driver.switchContext('NATIVE_APP') might be required for screenshot if flutter driver fails
            const screenshot = await driver.takeScreenshot();
            const timestamp = new Date().getTime();
            const filePath = `./reports/failures/screenshot_${timestamp}.png`;
            import('fs').then(fs => fs.writeFileSync(filePath, screenshot, 'base64'));

            global.excelReporter.addFailure({
                name: test.title,
                reason: error.message,
                screenshot: filePath,
                device: capabilities[0]['appium:deviceName'],
                version: capabilities[0]['appium:platformVersion'] || 'Unknown'
            });
        }
        
        global.excelReporter.addTestResult({
            id: `TC_${Date.now()}`,
            module: test.parent,
            scenario: test.title,
            device: capabilities[0]['appium:deviceName'],
            status: passed ? 'passed' : 'failed',
            start: new Date(Date.now() - duration).toISOString(),
            end: new Date().toISOString(),
            duration: duration
        });
    },

    onComplete: async function(exitCode, config, capabilities, results) {
        await global.excelReporter.generateReport();
    }
}
