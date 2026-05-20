const { Builder, By, until } = require('selenium-webdriver');

async function testLogin() {
  // Initialize the Chrome browser
  console.log("Starting browser...");
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // Navigate to the login page
    console.log("Navigating to login page...");
    await driver.get('http://localhost:3000/login');
    await driver.manage().window().maximize();

    // Wait until the email field is rendered
    await driver.wait(until.elementLocated(By.id('userEmail')), 10000);

    const emailField = await driver.findElement(By.id('userEmail'));
    const passwordField = await driver.findElement(By.id('userPass'));
    const submitBtn = await driver.findElement(By.css("button[type='submit']"));

    // Enter credentials
    const testEmail = "test@05gmail.com";
    const testPassword = "Test@05";

    console.log(`Entering Email: ${testEmail}`);
    await emailField.sendKeys(testEmail);

    console.log("Entering Password...");
    await passwordField.sendKeys(testPassword);

    // Optional: Test the eye toggle
    try {
      const eyeButton = await driver.findElement(By.css("button[aria-label='Show password']"));
      await eyeButton.click();
      await driver.sleep(1000); // Wait 1 second to visibly see the text
    } catch(err) {
        // ignore if button not found
    }

    console.log("Clicking Submit...");
    await driver.executeScript("arguments[0].click();", submitBtn);

    // Verify Result: Wait to see if we get routed to the dashboard URL
    await driver.wait(until.urlContains('/dashboard'), 5000);
    
    console.log("\n✅ TEST PASSED: Successfully logged in and redirected to the Dashboard!");

  } catch (error) {
    console.log(`\n❌ TEST FAILED: ${error.message}`);
  } finally {
    // Keep browser open for a short time to review, then quit
    await driver.sleep(3000);
    console.log("Closing browser...");
    await driver.quit();
  }
}

testLogin();
