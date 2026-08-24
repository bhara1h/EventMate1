import * as find from 'appium-flutter-finder';

/**
 * Reusable Mobile Gestures for WebdriverIO utilizing Flutter Driver capabilities.
 */
export class FlutterGestures {
    static async tap(finder) {
        await driver.execute('flutter:waitFor', finder, 10000);
        await driver.execute('flutter:click', finder);
    }

    static async doubleTap(finder) {
        await driver.execute('flutter:waitFor', finder, 10000);
        await driver.execute('flutter:doubleClick', finder);
    }

    static async longPress(finder) {
        await driver.execute('flutter:waitFor', finder, 10000);
        await driver.execute('flutter:longTap', finder);
    }

    static async scrollUntilVisible(listViewFinder, itemFinder, dxScroll = 0, dyScroll = -100) {
        // flutter:scrollUntilVisible takes the finder to scroll, the item to find, and scroll amount
        await driver.execute('flutter:scrollUntilVisible', listViewFinder, {
            item: itemFinder,
            dxScroll: dxScroll,
            dyScroll: dyScroll,
        });
    }
}
