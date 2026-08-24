const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function runSeleniumDebug() {
  const options = new chrome.Options();
  options.addArguments('--headless');
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1280,800');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    console.log('1. Navigating to Auth page...');
    await driver.get('http://localhost:5173/auth');
    await driver.sleep(1000);

    // Let's create a new student user to be clean
    console.log('2. Signing up a new Student...');
    // Click Sign up button
    const signUpBtn = await driver.findElement(By.xpath("//button[text()='Sign up']"));
    await signUpBtn.click();
    await driver.sleep(500);

    const email = `test_student_${Date.now()}@example.com`;
    await driver.findElement(By.name('name')).sendKeys('Test Student');
    await driver.findElement(By.name('email')).sendKeys(email);
    await driver.findElement(By.name('password')).sendKeys('password123');
    
    // Role is already Student by default, let's click Create Account
    const submitBtn = await driver.findElement(By.xpath("//button[text()='Create Account']"));
    await submitBtn.click();
    await driver.sleep(2000);

    let currentUrl = await driver.getCurrentUrl();
    console.log(`Current URL after registration: ${currentUrl}`);

    // Create an event so that the student dashboard has events to register for.
    // Wait, let's look at the student dashboard to see if there is any event visible.
    console.log('3. Checking discover events list...');
    const eventCards = await driver.findElements(By.xpath("//button[text()='Register Now']"));
    console.log(`Found ${eventCards.length} events on student dashboard.`);

    if (eventCards.length > 0) {
      console.log('4. Clicking Register Now...');
      await eventCards[0].click();
      await driver.sleep(1000);

      // Check if there is an alert/confirm
      try {
        const alert = await driver.switchTo().alert();
        const text = await alert.getText();
        console.log(`Alert text present: ${text}`);
        await alert.accept();
        await driver.sleep(1000);
      } catch (e) {
        console.log('No first alert.');
      }

      // Check if there is a second alert (e.g. success alert)
      try {
        const alert = await driver.switchTo().alert();
        const text = await alert.getText();
        console.log(`Second alert text present: ${text}`);
        await alert.accept();
        await driver.sleep(1000);
      } catch (e) {
        console.log('No second alert.');
      }
    } else {
      console.log('No events available. We might need to seed an event.');
    }

    currentUrl = await driver.getCurrentUrl();
    console.log(`Final URL: ${currentUrl}`);

    // Let's check console logs
    const logs = await driver.manage().logs().get('browser');
    console.log('Browser Logs:', logs);

  } catch (error) {
    console.error('Error during selenium debug run:', error);
  } finally {
    await driver.quit();
  }
}

runSeleniumDebug();
