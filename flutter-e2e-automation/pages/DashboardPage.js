import BasePage from './BasePage.js';
import { FlutterGestures } from '../utilities/FlutterGestures.js';

class DashboardPage extends BasePage {
    get snackbar() { return this.finder.byType('SnackBar'); }
    get bottomSheet() { return this.finder.byType('BottomSheet'); }
    get listView() { return this.finder.byValueKey('main_list'); }

    async scrollToItemByText(text) {
        const itemFinder = this.finder.byText(text);
        await FlutterGestures.scrollUntilVisible(this.listView, itemFinder);
    }

    async getSnackbarText() {
        // Find text widget inside snackbar
        const textFinder = this.finder.descendant({
            of: this.snackbar,
            matching: this.finder.byType('Text')
        });
        return await this.getText(textFinder);
    }
}

export default new DashboardPage();
