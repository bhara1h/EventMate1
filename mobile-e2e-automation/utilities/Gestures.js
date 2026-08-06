/**
 * Reusable Mobile Gestures for WebdriverIO (W3C standard)
 */
export class Gestures {
    static async tap(element) {
        await element.click();
    }

    static async swipeUp(percentage = 0.5) {
        const { width, height } = await driver.getWindowSize();
        const startY = height * 0.8;
        const endY = height * (0.8 - percentage);
        const anchor = width * 0.5;

        await driver.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: anchor, y: startY },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 100 },
                { type: 'pointerMove', duration: 1000, x: anchor, y: endY },
                { type: 'pointerUp', button: 0 }
            ]
        }]);
    }

    static async swipeDown(percentage = 0.5) {
        const { width, height } = await driver.getWindowSize();
        const startY = height * 0.2;
        const endY = height * (0.2 + percentage);
        const anchor = width * 0.5;

        await driver.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: anchor, y: startY },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 100 },
                { type: 'pointerMove', duration: 1000, x: anchor, y: endY },
                { type: 'pointerUp', button: 0 }
            ]
        }]);
    }

    static async scrollUntilVisible(elementLocator, maxSwipes = 5) {
        let isVisible = false;
        let swipes = 0;
        while (!isVisible && swipes < maxSwipes) {
            try {
                const el = await $(elementLocator);
                isVisible = await el.isDisplayed();
                if (isVisible) return true;
            } catch (e) {
                // Not found yet
            }
            await this.swipeUp();
            swipes++;
        }
        return false;
    }
}
