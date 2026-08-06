import { FlutterGestures } from '../utilities/FlutterGestures.js';
import * as find from 'appium-flutter-finder';

export default class BasePage {
    // Expose finders globally for page objects
    get finder() { return find; }

    async tap(elementFinder) {
        await FlutterGestures.tap(elementFinder);
    }

    async enterText(elementFinder, text) {
        await this.tap(elementFinder); // Flutter requires focus before typing
        await driver.execute('flutter:enterText', text);
    }

    async getText(elementFinder) {
        return await driver.execute('flutter:getText', elementFinder);
    }
}
