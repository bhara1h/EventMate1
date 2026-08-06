import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import firefox from 'selenium-webdriver/firefox.js';
import edge from 'selenium-webdriver/edge.js';
import { config } from '../config/default.js';

export class DriverSetup {
    static async getDriver() {
        let driver;
        const browser = config.browser.toLowerCase();

        switch (browser) {
            case 'firefox':
                let firefoxOptions = new firefox.Options();
                if (config.headless) firefoxOptions.addArguments('--headless');
                driver = await new Builder().forBrowser('firefox').setFirefoxOptions(firefoxOptions).build();
                break;
            case 'edge':
                let edgeOptions = new edge.Options();
                if (config.headless) edgeOptions.addArguments('--headless');
                driver = await new Builder().forBrowser('MicrosoftEdge').setEdgeOptions(edgeOptions).build();
                break;
            case 'chrome':
            default:
                let chromeOptions = new chrome.Options();
                if (config.headless) chromeOptions.addArguments('--headless');
                chromeOptions.addArguments('--disable-gpu');
                chromeOptions.addArguments('--window-size=1920,1080');
                driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
                break;
        }

        await driver.manage().setTimeouts({ implicit: config.timeouts.implicit });
        if (!config.headless) {
            await driver.manage().window().maximize();
        }
        return driver;
    }
}
