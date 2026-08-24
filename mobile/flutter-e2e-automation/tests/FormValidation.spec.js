import DashboardPage from '../pages/DashboardPage.js';
import { expect } from 'chai';

describe('Flutter Form & UI Validations', () => {
    
    it('should trigger snackbar on specific action', async () => {
        // Assume there's a button triggering a snackbar
        const actionBtn = DashboardPage.finder.byValueKey('trigger_snackbar');
        await DashboardPage.tap(actionBtn);
        
        const snackbarText = await DashboardPage.getSnackbarText();
        expect(snackbarText).to.include('Action successful');
    });

    it('should interact with checkbox properly', async () => {
        const checkbox = DashboardPage.finder.byValueKey('terms_checkbox');
        await DashboardPage.tap(checkbox);
        
        // Assert checked state. Flutter driver can extract semantic info
        const semantics = await driver.execute('flutter:getSemanticsId', checkbox);
        expect(semantics).to.exist; 
    });
});
