import DashboardPage from '../pages/DashboardPage.js';
import { expect } from 'chai';

describe('Flutter Navigation & Scrolling Tests', () => {

    it('should scroll list view until specific item is visible', async () => {
        // Test scrolling dynamics
        await DashboardPage.scrollToItemByText('Target Item 50');
        
        // Verify it was found
        const target = DashboardPage.finder.byText('Target Item 50');
        await driver.execute('flutter:waitFor', target, 5000);
    });

    it('should navigate to drawer screen and back', async () => {
        const drawerIcon = DashboardPage.finder.byTooltip('Open navigation menu');
        await DashboardPage.tap(drawerIcon);
        
        const drawerItem = DashboardPage.finder.byText('Settings');
        await DashboardPage.tap(drawerItem);
        
        // Settings title should be visible
        await driver.execute('flutter:waitFor', DashboardPage.finder.byText('Settings Title'));
    });
});
