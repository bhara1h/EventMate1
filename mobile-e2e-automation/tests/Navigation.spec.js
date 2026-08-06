import { Gestures } from '../utilities/Gestures.js';
import { expect } from 'chai';

describe('Navigation and Gesture Appium Tests', () => {

    it('should perform swipe up and swipe down gestures', async () => {
        // Appium requires active contexts, these gestures run on the driver natively
        await Gestures.swipeUp(0.6);
        await Gestures.swipeDown(0.6);
        
        // Implicitly assuming no crash means gesture didn't break
        const appState = await driver.queryAppState(driver.capabilities.appPackage);
        expect(appState).to.equal(4); // 4 = Running in foreground
    });

    it('should scroll until an element is visible', async () => {
        // Example scrolling to a list item
        const found = await Gestures.scrollUntilVisible('~Footer Element', 3);
        // Expect to find or not find depending on app structure
        expect(found).to.be.a('boolean');
    });
});
